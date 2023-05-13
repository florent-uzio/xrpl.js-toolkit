import color from "colors"
import * as xrpl from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type CreateOfferProps = Omit<xrpl.OfferCreate, "TransactionType" | "Account">

/**
 * Create a DEX offer.
 */
export const createOffer = async (
  { TakerGets, TakerPays, ...rest }: CreateOfferProps,
  { wallet }: TxnOptions
) => {
  console.log(color.bold("******* LET'S CREATE A DEX OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  //   Convert the amount to drops (1 drop = .000001 XRP) or the currency to HEX
  if (typeof TakerGets === "string") {
    TakerGets = xrpl.xrpToDrops(TakerGets)
  } else {
    TakerGets.currency = convertCurrencyCodeToHex(TakerGets.currency)
  }

  if (typeof TakerPays === "string") {
    TakerPays = xrpl.xrpToDrops(TakerPays)
  } else {
    TakerPays.currency = convertCurrencyCodeToHex(TakerPays.currency)
  }

  // Construct the base payment transaction
  const transaction: xrpl.OfferCreate = {
    Account: wallet.address,
    TransactionType: "OfferCreate",
    TakerGets,
    TakerPays,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
