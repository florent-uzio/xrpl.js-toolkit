import color from "colors"
import { SignerListSet } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type SignerListSetProps = Omit<SignerListSet, "TransactionType" | "Account">

export const setSignerList = async (props: SignerListSetProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S SET A SIGNER LIST *******"))
  console.log()

  // Construct the base transaction
  const transaction: SignerListSet = {
    Account: opts.wallet.address,
    TransactionType: "SignerListSet",
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
