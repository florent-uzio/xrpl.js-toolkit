import color from "colors"
import { EscrowCancel } from "xrpl"
import { prepareSignSubmit } from "../../helpers"
import { TxnOptions } from "../../models"

type CancelEscrowProps = Omit<EscrowCancel, "TransactionType" | "Account">

export const cancelEscrow = async (props: CancelEscrowProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CANCEL AN ESCROW *******"))
  console.log()

  // Construct the base transaction
  const transaction: EscrowCancel = {
    TransactionType: "EscrowCancel",
    Account: opts.wallet.address,
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
