import color from "colors"
import { OfferCancel } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type CancelOfferProps = Omit<OfferCancel, "TransactionType" | "Account">

/**
 * Cancel a DEX offer.
 * https://xrpl.org/offercancel.html
 */
export const cancelOffer = async (props: CancelOfferProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CANCEL A DEX OFFER *******"))
  console.log()

  // Construct the base payment transaction
  const transaction: OfferCancel = {
    Account: opts.wallet.address,
    TransactionType: "OfferCancel",
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
