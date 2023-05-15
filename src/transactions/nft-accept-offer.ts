import color from "colors"
import { NFTokenAcceptOffer } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type AcceptNftOfferProps = Omit<NFTokenAcceptOffer, "TransactionType" | "Account">

export const acceptNftOffer = async (props: AcceptNftOfferProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S ACCEPT AN NFT OFFER *******"))
  console.log()

  // Construct the base transaction
  const transaction: NFTokenAcceptOffer = {
    Account: opts.wallet.address,
    TransactionType: "NFTokenAcceptOffer",
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
