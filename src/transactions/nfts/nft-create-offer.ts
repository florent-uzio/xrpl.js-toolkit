import color from "colors"
import { NFTokenCreateOffer, NFTokenCreateOfferFlags, xrpToDrops } from "xrpl"
import { prepareSignSubmit } from "../../helpers"
import { TxnOptions } from "../../models"

type CreateNftOfferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account"> &
  (
    | { Flags: NFTokenCreateOfferFlags.tfSellNFToken; Owner?: never }
    | { Flags?: undefined; Owner: string }
  )

export const createNftOffer = async (
  { Amount, ...rest }: CreateNftOfferProps,
  opts: TxnOptions,
) => {
  console.log(color.bold("******* LET'S CREATE AN NFT OFFER *******"))
  console.log()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  }

  // Construct the base transaction
  const transaction: NFTokenCreateOffer = {
    Account: opts.wallet.address,
    Amount,
    TransactionType: "NFTokenCreateOffer",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
