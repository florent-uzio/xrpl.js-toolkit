import { AccountSetAsfFlags, Client, TrustSetFlags, Wallet } from "xrpl"
import { submitTxnAndWait } from "./transactions"

const CURRENCY_CODE = "TST"
const MAX_IOU_AMOUNT = "1000000" // one million

export async function clientCode(client: Client) {
  console.log("Creating accounts...")
  const [holderA, issuerA, exchangerX, issuerB, holderB] = await Promise.all([
    client.fundWallet(),
    client.fundWallet(),
    client.fundWallet(),
    client.fundWallet(),
    client.fundWallet(),
  ]).then((results) => results.map((result) => result.wallet))

  // Print out the addresses and seed of the accounts
  console.log(
    JSON.stringify(
      {
        holderA: holderA,
        issuerA: issuerA,
        exchangerX: exchangerX,
        issuerB: issuerB,
        holderB: holderB,
      },
      null,
      2,
    ),
  )
  console.log()

  console.log("Setting up issuer accounts...")
  await Promise.all([
    submitTxnAndWait({
      txn: {
        Account: issuerA.address,
        TransactionType: "AccountSet",
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
      },
      client,
      wallet: issuerA,
    }),
    submitTxnAndWait({
      txn: {
        Account: issuerB.address,
        TransactionType: "AccountSet",
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
      },
      client,
      wallet: issuerB,
    }),
  ])
  console.log()

  console.log("Setting up trustlines...")
  await Promise.all([
    setupTrustline(client, holderA, issuerA.address, false),
    setupTrustline(client, exchangerX, issuerA.address, true),
  ])

  await Promise.all([
    setupTrustline(client, exchangerX, issuerB.address, true),
    setupTrustline(client, holderB, issuerB.address, false),
  ])
  console.log()

  console.log("Issuing tokens from issuerA to holderA and from issuerB to exchangerX...")
  await Promise.all([
    mint(client, issuerA, holderA.address, "1000"),
    mint(client, issuerB, exchangerX.address, "3000"),
  ])
  console.log()

  console.log("Issuing tokens from issuerA to exchangerX and from issuerB to holderB...")
  await Promise.all([
    mint(client, issuerA, exchangerX.address, "2000"),
    mint(client, issuerB, holderB.address, "4000"),
  ])
  console.log()

  console.log("Finding payment path from holderA to holderB...")
  const resp = await client.request({
    command: "ripple_path_find",
    source_account: holderA.address,
    source_currencies: [
      {
        currency: CURRENCY_CODE,
        issuer: issuerA.address,
      },
    ],
    destination_account: holderB.address,
    destination_amount: {
      currency: CURRENCY_CODE,
      issuer: issuerB.address,
      value: "100",
    },
  })
  console.log(JSON.stringify(resp, null, 2))
}

async function setupTrustline(client: Client, from: Wallet, token: string, rippleEnabled: boolean) {
  await submitTxnAndWait({
    txn: {
      Account: from.address,
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: CURRENCY_CODE,
        issuer: token,
        value: MAX_IOU_AMOUNT,
      },
      Flags: rippleEnabled ? 0 : TrustSetFlags.tfSetNoRipple,
    },
    client,
    wallet: from,
  })
}

async function mint(client: Client, issuer: Wallet, to: string, amount: string) {
  await submitTxnAndWait({
    txn: {
      Account: issuer.address,
      TransactionType: "Payment",
      Amount: {
        currency: CURRENCY_CODE,
        issuer: issuer.address,
        value: amount,
      },
      Destination: to,
    },
    client,
    wallet: issuer,
  })
}
