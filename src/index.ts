import * as dotenv from "dotenv"
import { XRPLToolkit } from "./clients"
import { networks } from "./networks"
import { WALLET_1 } from "./wallets"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const toolkit = new XRPLToolkit(networks.devnet.ripple)

  await toolkit.submitTxnAndWait({
    txn: {
      TransactionType: "AccountSet",
      Account: WALLET_1.address,
      Domain: "example.com",
    },
    wallet: WALLET_1,
    run: false,
  })
}

// Will run the main function above. Do not comment.
main()
