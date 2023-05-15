import color from "colors"
import * as xrpl from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type SendPaymentProps = Omit<xrpl.Payment, "TransactionType" | "Account">

export const sendPayment = async ({ Amount, ...rest }: SendPaymentProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S SEND A PAYMENT *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpl.xrpToDrops(Amount)
  } else {
    Amount.currency = convertCurrencyCodeToHex(Amount.currency)
  }

  // Construct the base payment transaction
  const transaction: xrpl.Payment = {
    Account: opts.wallet.address,
    Amount,
    TransactionType: "Payment",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)

  await xrplClient.disconnect()
}
