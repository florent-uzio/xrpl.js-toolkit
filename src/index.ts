import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { clientCode } from "./client-code"
import { submitMethod } from "./methods"
import { networks } from "./networks"
dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TST".
const TOKEN = process.env.TOKEN ?? "TST"

const main = async () => {
  const client = new Client(networks.devnet.ripple)

  // Do not comment
  await client.connect()

  // Write your code here

  await clientCode(client)

  // To run the submitMethod function, set its "run" parameter to true below
  await submitMethod({
    request: {
      command: "ripple_path_find",
      source_account: "...",
      source_currencies: [
        {
          currency: "TST",
          issuer: "...",
        },
      ],
      destination_account: "...",
      destination_amount: {
        currency: "TST",
        issuer: "...",
        value: "100",
      },
    },
    client,
    run: false, // set to true to run the function
  })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
