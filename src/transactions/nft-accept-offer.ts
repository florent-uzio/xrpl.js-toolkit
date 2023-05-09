import color from "colors"
import { NFTokenAcceptOffer, Wallet } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { xrplClient } from "../xrpl-client"

type acceptNftOfferProps = {
  wallet: Wallet
} & ({ buyOfferId: string; sellOfferId?: never } | { buyOfferId?: never; sellOfferId: string })

export const acceptNftOffer = async ({ buyOfferId, sellOfferId, wallet }: acceptNftOfferProps) => {
  console.log(color.bold("******* LET'S ACCEPT AN NFT OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: NFTokenAcceptOffer = {
    Account: wallet.address,
    TransactionType: "NFTokenAcceptOffer",
  }

  if (sellOfferId) {
    transaction.NFTokenSellOffer = sellOfferId
  }
  if (buyOfferId) {
    transaction.NFTokenBuyOffer = buyOfferId
  }
  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
