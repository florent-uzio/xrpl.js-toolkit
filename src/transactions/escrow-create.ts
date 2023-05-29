import color from "colors"
import { EscrowCreate, xrpToDrops } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type CreateEscrowProps = Omit<EscrowCreate, "TransactionType" | "Account"> &
  ({ CancelAfter: number; FinishAfter?: number } | { CancelAfter?: number; FinishAfter: number })

export const createEscrow = async ({ Amount, ...rest }: CreateEscrowProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CREATE AN ESCROW *******"))
  console.log()

  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  }

  // Construct the base transaction
  const transaction: EscrowCreate = {
    TransactionType: "EscrowCreate",
    Account: opts.wallet.address,
    Amount,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
