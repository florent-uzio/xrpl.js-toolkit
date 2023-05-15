import color from "colors"
import * as xrpl from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type AccountSetProps = Omit<xrpl.AccountSet, "TransactionType" | "Account">

/**
 * Create an Account Set.
 */
export const accountSet = async ({ ...rest }: AccountSetProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CREATE AN ACCOUNT SET *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: xrpl.AccountSet = {
    Account: opts.wallet.address,
    TransactionType: "AccountSet",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)

  await xrplClient.disconnect()
}
