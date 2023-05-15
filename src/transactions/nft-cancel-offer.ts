import color from "colors"
import { NFTokenCancelOffer } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

// type cancelNftOfferProps = {
//   offerIds: string[]
//   wallet: xrpl.Wallet
// }

type CancelNftOfferProps = Omit<NFTokenCancelOffer, "TransactionType" | "Account">

export const cancelNftOffer = async (props: CancelNftOfferProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CANCEL AN NFT OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: NFTokenCancelOffer = {
    Account: opts.wallet.address,
    TransactionType: "NFTokenCancelOffer",
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)

  await xrplClient.disconnect()
}
