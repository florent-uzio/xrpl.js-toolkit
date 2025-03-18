import * as dotenv from "dotenv"
import { AccountSetAsfFlags, Client, TrustSetFlags, Wallet } from "xrpl"
import { networks } from "./networks"

import { submitMethod } from "./methods"
import { runTokenIssuanceTasks } from "./tasks"
import usdbTest from "./tasks/issue-token/output/results--2025-03-17T18:30:07.603Z.json"
import usdbAllow from "./tasks/issue-token/output/results-setup-USDBAllow-2025-03-17T17:45:18.994Z.json"
import { submitTxnAndWait } from "./transactions"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const USDB_TOKEN = "USDB"
const USDB_OFFER_AMOUNT = "9999999999999999e80"

const USDB_ALLOW_TOKEN = "USDBAllow"

const main = async () => {
  // Write your code here

  const client = new Client(networks.devnet.ripple)
  await client.connect()

  // await setupAll()

  await submitMethod({
    request: {
      command: "account_lines",
      account: usdbAllow.holders[0].classicAddress,
    },
    client,
    run: false,
  })

  await submitMethod({
    request: {
      command: "account_lines",
      account: usdbAllow.holders[1].classicAddress,
    },
    client,
    run: false,
  })

  // await showBookOffers(client, usdb.issuer.classicAddress, usdbAllow.issuer.classicAddress)

  // await makePaymentToMint(
  //   client,
  //   Wallet.fromSeed(usdbAllow.holders[0].seed ?? ""),
  //   Wallet.fromSeed(usdb.holders[0].seed ?? ""),
  //   usdbAllow.issuer.classicAddress,
  //   usdb.issuer.classicAddress,
  // )

  await runTokenIssuanceTasks({
    network: networks.devnet.ripple,
    holderAccountCount: 2,
    operationalAccountCount: 2,
    trustLineParams: {
      currency: USDB_TOKEN,
      value: "1e9",
    },
    mintToHolders: true,
    issuerSettings: {
      setFlags: [AccountSetAsfFlags.asfDefaultRipple, AccountSetAsfFlags.asfDepositAuth],
    },
    run: false,
  })

  await submitTxnAndWait({
    txn: {
      Account: usdbTest.issuer.classicAddress,
      TransactionType: "AccountSet",
      ClearFlag: AccountSetAsfFlags.asfGlobalFreeze,
    },
    client,
    wallet: Wallet.fromSeed(usdbTest.issuer.seed ?? ""),
    run: false,
  })

  await submitTxnAndWait({
    txn: {
      Account: usdbTest.issuer.classicAddress,
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: USDB_TOKEN,
        value: "0",
        issuer: usdbTest.holders[1].classicAddress,
      },
      Flags: TrustSetFlags.tfSetFreeze | TrustSetFlags.tfSetDeepFreeze,
    },
    client,
    wallet: Wallet.fromSeed(usdbTest.issuer.seed ?? ""),
    run: false,
  })

  await submitTxnAndWait({
    txn: {
      Account: usdbTest.holders[1].classicAddress,
      TransactionType: "Payment",
      Destination: usdbTest.issuer.classicAddress,
      Amount: {
        currency: USDB_TOKEN,
        value: "1",
        issuer: usdbTest.issuer.classicAddress,
      },
    },
    client,
    wallet: Wallet.fromSeed(usdbTest.holders[1].seed ?? ""),
    run: false,
  })

  await submitMethod({
    request: {
      command: "account_lines",
      account: "rnHfmvMG2vwxz3MRqzLnxAE3RY4DuwRhmN",
    },
    client,
    run: true,
  })
  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
