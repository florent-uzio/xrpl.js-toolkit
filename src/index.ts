import * as dotenv from "dotenv"
import { AccountSetAsfFlags, Client, Wallet } from "xrpl"
import { networks } from "./networks"
import walletsData from "./tasks/issue-token/output/results-2025-01-21T08:17:56.577Z.json"
import { submitTxnAndWait } from "./transactions"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.devnet.ripple)

  const issuer = Wallet.fromSeed(walletsData.issuer.seed)

  // Do not comment
  await client.connect()

  // await issueTokenTasks({
  //   network: networks.devnet.ripple,
  //   numOperationalAccounts: 1,
  //   numHolderAccounts: 2,
  //   fundingOptions: { amount: "75" },
  //   issuerSettings: {
  //     // Domain: "https://test.flo.com",
  //     // TickSize: 6,
  //     // TransferRate: 1400000000,
  //     setFlags: [
  //       AccountSetAsfFlags.asfRequireAuth,
  //       AccountSetAsfFlags.asfDefaultRipple,
  //       // AccountSetAsfFlags.asfDepositAuth,
  //     ],
  //   },
  //   trustSetParams: {
  //     currency: TOKEN,
  //     value: "200000000",
  //     Flags: TrustSetFlags.tfSetNoRipple,
  //   },
  // })

  await submitTxnAndWait({
    txn: {
      Account: issuer.address,
      TransactionType: "AccountSet",
      ClearFlag: AccountSetAsfFlags.asfRequireAuth,
    },
    client,
    wallet: issuer,
  })

  // await submitMethod({
  //   request: {
  //     command: "account_info",
  //     account: "r9PWipZ2RnksPYQNEmaRdiSfxo7jQDs1hW",
  //     api_version: 2,
  //   },
  //   client,
  // })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
