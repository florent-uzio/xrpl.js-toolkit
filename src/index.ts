import * as dotenv from "dotenv"
import type { MPTokenAuthorize, MPTokenIssuanceCreate, MPTokenMetadata, Payment } from "xrpl"
import { Client, Wallet, encodeMPTokenMetadata, validateMPTokenMetadata, xrpToDrops } from "xrpl"
import { networks } from "./networks"
import { WALLET_1, WALLET_2, WALLET_3, WALLET_4 } from "./wallets"

dotenv.config()

const MINT_AMOUNT = "1000"
const MIN_HOLDER_XRP = 1.3
const NETWORK = process.env.NETWORK ?? "devnet"

const getNetworkUrl = () => {
  if (NETWORK === "mainnet") return networks.mainnet.rippleS1
  if (NETWORK === "testnet") return networks.testnet.ripple
  return networks.devnet.ripple
}

// Returns true if XRP was sent, false if the account already had sufficient balance.
const ensureHolderFunded = async (
  client: Client,
  issuer: Wallet,
  holder: Wallet,
): Promise<boolean> => {
  const targetDrops = BigInt(xrpToDrops(MIN_HOLDER_XRP))
  let currentDrops = 0n

  try {
    const { result } = await client.request({
      command: "account_info",
      account: holder.classicAddress,
      ledger_index: "validated",
    })
    currentDrops = BigInt(result.account_data.Balance)
    if (currentDrops >= targetDrops) return false
  } catch {
    // Account does not exist on-chain yet
  }

  const fundTx: Payment = {
    TransactionType: "Payment",
    Account: issuer.classicAddress,
    Destination: holder.classicAddress,
    Amount: (targetDrops - currentDrops).toString(),
  }
  await client.submitAndWait(fundTx, { autofill: true, wallet: issuer })
  return true
}

const main = async () => {
  const client = new Client(getNetworkUrl())
  await client.connect()

  let issuer: Wallet
  let holderA: Wallet
  let holderB: Wallet
  let holderC: Wallet

  if (NETWORK === "mainnet") {
    issuer = WALLET_1
    holderA = WALLET_2
    holderB = WALLET_3
    holderC = WALLET_4

    console.log("Mainnet: checking holder wallet balances...")
    for (const [name, holder] of [
      ["A", holderA],
      ["B", holderB],
      ["C", holderC],
    ] as [string, Wallet][]) {
      const funded = await ensureHolderFunded(client, issuer, holder)
      console.log(
        funded
          ? `  Holder ${name} (${holder.classicAddress}): funded with at least 1.3 XRP`
          : `  Holder ${name} (${holder.classicAddress}): balance sufficient, skipping`,
      )
    }
  } else {
    console.log("Funding wallets via faucet...")
    const [r0, r1, r2, r3] = await Promise.all([
      client.fundWallet(null, { amount: "10" }),
      client.fundWallet(null, { amount: "2" }),
      client.fundWallet(null, { amount: "2" }),
      client.fundWallet(null, { amount: "2" }),
    ])
    issuer = r0.wallet
    holderA = r1.wallet
    holderB = r2.wallet
    holderC = r3.wallet
  }

  console.log(`Issuer:   ${issuer.classicAddress}`)
  console.log(`Holder A: ${holderA.classicAddress}`)
  console.log(`Holder B: ${holderB.classicAddress}`)
  console.log(`Holder C: ${holderC.classicAddress}`)

  // Create MPT with all flags except tfMPTCanLock and tfMPTRequireAuth
  console.log("\nCreating MPT...")

  const mptMetadata: MPTokenMetadata = {
    ticker: "ACME",
    name: "Acme Corp Token",
    desc: "Utility token issued by Acme Corp for internal settlements",
    icon: "https://acmecorp.example/token-icon.png",
    asset_class: "rwa",
    asset_subclass: "stablecoin",
    issuer_name: "Acme Corp",
  }

  const encodedMetadata = encodeMPTokenMetadata(mptMetadata)
  const metadataErrors = validateMPTokenMetadata(encodedMetadata)
  if (metadataErrors.length > 0) {
    throw new Error(`Invalid MPT metadata:\n${metadataErrors.map((e) => `  - ${e}`).join("\n")}`)
  }

  const createTx: MPTokenIssuanceCreate = {
    TransactionType: "MPTokenIssuanceCreate",
    Account: issuer.classicAddress,
    MaximumAmount: "1000000",
    MPTokenMetadata: encodedMetadata,
    Flags: {
      tfMPTCanEscrow: true,
      tfMPTCanTrade: true,
      tfMPTCanTransfer: true,
      tfMPTCanClawback: true,
    },
  }
  const createResult = await client.submitAndWait(createTx, { autofill: true, wallet: issuer })
  const mptIssuanceId = (createResult.result.meta as { mpt_issuance_id: string }).mpt_issuance_id
  console.log(`MPT created. Issuance ID: ${mptIssuanceId} | Hash: ${createResult.result.hash}`)

  // Holders authorize the MPT (creates their MPToken entry)
  console.log("\nHolders authorizing MPT...")
  for (const [name, holder] of [
    ["A", holderA],
    ["B", holderB],
    ["C", holderC],
  ] as [string, Wallet][]) {
    const authTx: MPTokenAuthorize = {
      TransactionType: "MPTokenAuthorize",
      Account: holder.classicAddress,
      MPTokenIssuanceID: mptIssuanceId,
    }
    const authResult = await client.submitAndWait(authTx, { autofill: true, wallet: holder })
    console.log(`  Holder ${name} authorized | Hash: ${authResult.result.hash}`)
  }

  // Issuer mints to Holder A
  console.log("\nMinting to Holder A...")
  const mintTx: Payment = {
    TransactionType: "Payment",
    Account: issuer.classicAddress,
    Destination: holderA.classicAddress,
    Amount: { mpt_issuance_id: mptIssuanceId, value: MINT_AMOUNT },
  }
  const mintResult = await client.submitAndWait(mintTx, { autofill: true, wallet: issuer })
  console.log(`  Minted ${MINT_AMOUNT} MPT to Holder A | Hash: ${mintResult.result.hash}`)

  // Two full rounds of A→B→C→A so each holder makes at least 2 payments
  const transfers: [string, Wallet, string, Wallet][] = [
    ["A", holderA, "B", holderB],
    ["B", holderB, "C", holderC],
    ["C", holderC, "A", holderA],
    ["A", holderA, "B", holderB],
    ["B", holderB, "C", holderC],
    ["C", holderC, "A", holderA],
  ]

  console.log("\nExecuting transfers...")
  for (const [senderName, sender, receiverName, receiver] of transfers) {
    const payTx: Payment = {
      TransactionType: "Payment",
      Account: sender.classicAddress,
      Destination: receiver.classicAddress,
      Amount: { mpt_issuance_id: mptIssuanceId, value: MINT_AMOUNT },
    }
    const payResult = await client.submitAndWait(payTx, { autofill: true, wallet: sender })
    console.log(
      `  Holder ${senderName} → Holder ${receiverName}: ${MINT_AMOUNT} MPT | Hash: ${payResult.result.hash}`,
    )
  }

  console.log("\n Process finished")
  await client.disconnect()
}

main()
