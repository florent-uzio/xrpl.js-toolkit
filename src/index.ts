import * as dotenv from "dotenv"
import { AccountSetAsfFlags, Client } from "xrpl"
import { networks } from "./networks"
import { issueTokenTasks } from "./tasks"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.devnet.ripple)

  // Do not comment
  await client.connect()

  await issueTokenTasks({
    network: networks.devnet.ripple,
    numOperationalAccounts: 2,
    numHolderAccounts: 3,
    fundingOptions: { amount: "75" },
    issuerSettings: {
      Domain: "https://test.flo.com",
      TickSize: 6,
      TransferRate: 1400000000,
      setFlags: [
        AccountSetAsfFlags.asfRequireAuth,
        AccountSetAsfFlags.asfDefaultRipple,
        AccountSetAsfFlags.asfDepositAuth,
      ],
    },
  })

  // await submitTxnAndWait({
  //   txn: {
  //     Account: WALLET_1.address,
  //     TransactionType: "TicketCreate",
  //     TicketCount: 10,
  //   },
  //   client,
  //   wallet: WALLET_1,
  // })

  // await submitMethod({
  //   request: {
  //     command: "account_info",
  //     account: "r3UZSQkjJMt5JyZuEZwVRdfHUofPH7bzK8",
  //   },
  //   client,
  // })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
