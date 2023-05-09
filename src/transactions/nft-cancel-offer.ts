import color from "colors"
import * as xrpl from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { xrplClient } from "../xrpl-client"

type cancelNftOfferProps = {
  offerIds: string[]
  wallet: xrpl.Wallet
}

export const cancelNftOffer = async ({ offerIds, wallet }: cancelNftOfferProps) => {
  console.log(color.bold("******* LET'S CANCEL AN NFT OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: xrpl.NFTokenCancelOffer = {
    Account: wallet.address,
    TransactionType: "NFTokenCancelOffer",
    NFTokenOffers: offerIds,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
