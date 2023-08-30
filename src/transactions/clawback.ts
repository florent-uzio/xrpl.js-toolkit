import color from "colors"
import { Clawback } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type ClawbackProps = Omit<Clawback, "TransactionType" | "Account">

export const clawback = async (props: ClawbackProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CLAWBACK FUNDS *******"))
  console.log()

  // Construct the base transaction
  const transaction: Clawback = {
    TransactionType: "Clawback",
    Account: opts.wallet.address,
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
