import color from "colors"
import { TrustSet } from "xrpl"
import { OptionalExceptFor, convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type CreateTrustlineProps = Omit<OptionalExceptFor<TrustSet, "LimitAmount">, "TransactionType">

export const createTrustline = async (props: CreateTrustlineProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CREATE A TRUSTLINE *******"))
  console.log()

  // Destructure the wallet from the transaction options. https://www.w3schools.com/react/react_es6_destructuring.asp
  const { wallet } = opts

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: TrustSet = {
    Account: wallet.address,
    TransactionType: "TrustSet",
    ...props,
    LimitAmount: {
      ...props.LimitAmount,
      currency: convertCurrencyCodeToHex(props.LimitAmount.currency),
    },
  }

  // Autofill transaction with additional fields (such as LastLedgerSequence), sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
