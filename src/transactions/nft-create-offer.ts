import color from "colors"
import { NFTokenCreateOffer, NFTokenCreateOfferFlags, xrpToDrops } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type CreateNftOfferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account"> &
  (
    | { Flags: NFTokenCreateOfferFlags.tfSellNFToken; Owner?: never }
    | { Flags?: undefined; Owner: string }
  )

export const createNftOffer = async (
  { Amount, ...rest }: CreateNftOfferProps,
  { wallet }: TxnOptions
) => {
  console.log(color.bold("******* LET'S CREATE AN NFT OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  }

  // Construct the base transaction
  const transaction: NFTokenCreateOffer = {
    Account: wallet.address,
    Amount,
    TransactionType: "NFTokenCreateOffer",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
