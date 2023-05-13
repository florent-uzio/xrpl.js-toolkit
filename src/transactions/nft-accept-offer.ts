import color from "colors"
import { NFTokenAcceptOffer } from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type AcceptNftOfferProps = Omit<NFTokenAcceptOffer, "TransactionType" | "Account">

export const acceptNftOffer = async (props: AcceptNftOfferProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S ACCEPT AN NFT OFFER *******"))
  console.log()

  // Destructure the wallet from the options. https://www.w3schools.com/react/react_es6_destructuring.asp
  const { wallet } = opts

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: NFTokenAcceptOffer = {
    Account: wallet.address,
    TransactionType: "NFTokenAcceptOffer",
    ...props,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
