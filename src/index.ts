import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { submitMethod } from "./methods"
import { networks } from "./networks"
import { WALLET_1 } from "./wallets"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.testnet.ripple)

  // Do not comment
  await client.connect()

  // Write your code here...
  await submitMethod({
    request: {
      command: "account_info",
      account: WALLET_1.classicAddress,
    },
    client,
  })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
