import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { networks } from "./networks"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.RIPPLE_CLIO_TESTNET)

  // Do not comment
  await client.connect()

  /**
   *   ___  _   _
   *  / _ \| |_| |__   ___ _ __ ___
   * | | | | __| '_ \ / _ \ '__/ __|
   * | |_| | |_| | | |  __/ |  \__ \
   *  \___/ \__|_| |_|\___|_|  |___/
   */

  // await showAccountBalanceChanges(WALLET_1.address, client)

  // await showTxBalanceChanges(
  //   "8821A8EF3E1BC04B59FC2C4056EDC6C8440BF6E40B231D810936C159953A44E4",
  //   client,
  // )

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
