import * as dotenv from "dotenv"
import { AccountSetAsfFlags, Client, TrustSetFlags, Wallet } from "xrpl"
import { submitMethod } from "./methods"
import { networks } from "./networks"
import { runTokenIssuanceTasks } from "./tasks"
import { submitTxnAndWait } from "./transactions"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "USD"

const main = async () => {
  const client = new Client(networks.devnet.ripple)

  // Do not comment
  await client.connect()

  // Write your code here

  // Create one issuer and two holder accounts
  const ctx = await runTokenIssuanceTasks({
    network: networks.devnet.ripple,
    issuerSettings: {
      setFlags: [AccountSetAsfFlags.asfDefaultRipple],
    },
    holderAccountCount: 2,
    trustLineParams: {
      currency: TOKEN,
      value: "1000000",
    },
    run: true,
  })

  if (!ctx) {
    return
  }

  const { issuer, holderAccounts } = ctx

  console.log()
  console.log("Creating a third holder wallet that will then be preemptively deep frozen...")
  // Create a third wallet that will be preentively deep frozen
  const { wallet: deepFrozenWallet } = await client.fundWallet()

  console.log()
  console.log(`🌎 Issuer account: ${issuer.address}`)
  console.log(`🌎 Holder 0 account: ${holderAccounts[0].address}`)
  console.log(`🌎 Holder 1 account: ${holderAccounts[1].address}`)
  console.log(`🔒 Wallet to be deep frozen: ${deepFrozenWallet.address}`)
  console.log()

  // At this stage the 2 holders have the TOKEN in their balance
  const holder0Balance = await client.getBalances(holderAccounts[0].address)
  const holder1Balance = await client.getBalances(holderAccounts[0].address)

  console.log(`💵 holder0 balance: ${JSON.stringify(holder0Balance)}`)
  console.log(`💵 holder1 balance: ${JSON.stringify(holder1Balance)}`)
  console.log()

  // A payment from holder0 to holder1 works
  const paymentResponse = await submitTxnAndWait({
    txn: {
      Account: holderAccounts[0].address,
      TransactionType: "Payment",
      Destination: holderAccounts[1].address,
      Amount: {
        currency: TOKEN,
        value: "10",
        issuer: issuer.address,
      },
    },
    client,
    // @ts-expect-error works fine, there is a seed
    wallet: Wallet.fromSeed(holderAccounts[0].seed),
    showLogs: false,
  })
  console.log(`✅ Payment from holder0 to holder1 success: ${paymentResponse.result.hash}`)

  // DeepFreeze a third wallet
  const trustsetResponse = await submitTxnAndWait({
    txn: {
      Account: issuer.address, // must be the issuer
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: TOKEN,
        value: "0.1", // must be greater than 0 to have the trustline created
        issuer: deepFrozenWallet.address,
      },
      Flags: TrustSetFlags.tfSetFreeze | TrustSetFlags.tfSetDeepFreeze,
    },
    client,
    // @ts-expect-error works fine, there is a seed
    wallet: Wallet.fromSeed(issuer.seed), // must be the issuer seed
    showLogs: false,
  })
  console.log(`✅ TrustSet to deepfreeze the third wallet success: ${trustsetResponse.result.hash}`)

  // Set the trustset value back to 0
  const trustset2Response = await submitTxnAndWait({
    txn: {
      Account: issuer.address, // must be the issuer
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: TOKEN,
        value: "0", // back to 0
        issuer: deepFrozenWallet.address,
      },
      Flags: TrustSetFlags.tfSetFreeze | TrustSetFlags.tfSetDeepFreeze,
    },
    client,
    // @ts-expect-error works fine, there is a seed
    wallet: Wallet.fromSeed(issuer.seed), // must be the issuer seed
    showLogs: false,
  })
  console.log(
    `✅ TrustSet to set the value back to 0 for the third wallet success: ${trustset2Response.result.hash}`,
  )

  // Checking a payment can't be done from holder 0 to the deep frozen wallet
  const usdPayment = await submitTxnAndWait({
    txn: {
      Account: holderAccounts[0].address,
      TransactionType: "Payment",
      Destination: deepFrozenWallet.address,
      Amount: {
        currency: TOKEN,
        value: "10",
        issuer: issuer.address,
      },
    },
    client,
    // @ts-expect-error works fine, there is a seed
    wallet: Wallet.fromSeed(holderAccounts[0].seed),
    showLogs: false,
  })
  console.log(
    // @ts-expect-error works fine, there is a result
    `❌ Payment from holder0 to deepFrozenWallet failed as expected: ${usdPayment.result.meta.TransactionResult}, hash: ${usdPayment.result.hash}`,
  )

  console.log()
  console.log("Issuer account lines:")
  // show the issuer lines
  await submitMethod({
    request: {
      command: "account_lines",
      account: issuer.address,
    },
    client,
  })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
