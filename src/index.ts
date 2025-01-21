import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { networks } from "./networks"
// import walletsData from "./tasks/issue-token/output/results-2025-01-21T08:17:56.577Z.json"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.devnet.ripple)

  // const issuer = Wallet.fromSeed(walletsData.issuer.seed)

  // Do not comment
  await client.connect()

  // Write your code here

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
