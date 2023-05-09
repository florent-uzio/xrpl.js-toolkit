import color from "colors"
import * as xrpl from "xrpl"
import { Amount } from "xrpl/dist/npm/models/common"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { xrplClient } from "../xrpl-client"

type SendPaymentProps = {
  destination: string
  amount: Amount
  wallet: xrpl.Wallet
}

export const sendPayment = async ({ destination, amount, wallet }: SendPaymentProps) => {
  console.log(color.bold("******* LET'S SEND A PAYMENT *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof amount === "string") {
    amount = xrpl.xrpToDrops(amount)
  } else {
    amount.currency = convertCurrencyCodeToHex(amount.currency)
  }

  // Construct the base payment transaction
  const paymentTxn: xrpl.Payment = {
    Account: wallet.address,
    Amount: amount,
    Destination: destination,
    TransactionType: "Payment",
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(paymentTxn, wallet)

  await xrplClient.disconnect()
}
