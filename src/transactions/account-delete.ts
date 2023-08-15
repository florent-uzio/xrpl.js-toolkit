import color from "colors"
import { AccountDelete } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type AccountDeleteProps = Omit<AccountDelete, "TransactionType" | "Account">

/**
 * Delete an Account.
 */
export const deleteAccount = async ({ ...rest }: AccountDeleteProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S DELETE AN ACCOUNT *******"))
  console.log()

  // Construct the base transaction
  const transaction: AccountDelete = {
    Account: opts.wallet.address,
    TransactionType: "AccountDelete",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
