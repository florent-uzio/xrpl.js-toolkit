import color from "colors"
import * as xrpl from "xrpl"
import { Amount } from "xrpl/dist/npm/models/common"
import { prepareSignSubmit } from "../helpers"
import { xrplClient } from "../xrpl-client"

type createNftOfferProps = {
  amount: Amount
  tokenId: string
  wallet: xrpl.Wallet
} & ({ isSell: false; owner: string } | { isSell: true; owner?: never })

export const createNftOffer = async ({
  amount,
  isSell,
  owner,
  tokenId,
  wallet,
}: createNftOfferProps) => {
  console.log(color.bold("******* LET'S CREATE AN NFT OFFER *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof amount === "string") {
    amount = xrpl.xrpToDrops(amount)
  }

  // Construct the base transaction
  const transaction: xrpl.NFTokenCreateOffer = {
    Account: wallet.address,
    Amount: amount,
    Flags: isSell ? xrpl.NFTokenCreateOfferFlags.tfSellNFToken : undefined,
    NFTokenID: tokenId,
    TransactionType: "NFTokenCreateOffer",
  }

  if (owner) {
    transaction.Owner = owner
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
