import color from "colors"
import { EscrowFinish } from "xrpl"
import { prepareSignSubmit } from "../../helpers"
import { TxnOptions } from "../../models"

type FinishEscrowProps = Omit<EscrowFinish, "TransactionType" | "Account">

export const finishEscrow = async (props: FinishEscrowProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S FINISH AN ESCROW *******"))
  console.log()

  // Construct the base transaction
  const transaction: EscrowFinish = {
    TransactionType: "EscrowFinish",
    Account: opts.wallet.address,
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
