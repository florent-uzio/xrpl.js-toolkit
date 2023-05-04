import color from "colors"
import * as xrpl from "xrpl"
import { Amount } from "xrpl/dist/npm/models/common"
import { convertCurrencyCodeToHex } from "./helpers"
import { xrplClient } from "./xrpl-client"

type SendPaymentProps = {
  destination: string
  amount: Amount
  wallet: xrpl.Wallet
}

export const sendPayment = async ({ destination, amount, wallet }: SendPaymentProps) => {
  console.log(color.bold("******* LET'S SEND A PAYMENT *******"))
  console.log("")

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

  // Autofill transaction with additional fields.
  const preparedTxn = await xrplClient.autofill(paymentTxn)

  console.log(color.bold("******* Prepared Transaction *******"))
  console.log(preparedTxn)
  console.log(color.bold("************************************"))

  // Sign the transaction
  const signedTxn = wallet.sign(preparedTxn)

  console.log("")
  console.log(color.bold("******* Signed Transaction *******"))
  console.log(signedTxn)
  console.log(color.bold("************************************"))
  console.log("")

  // Start calculating the time to submit and validate this transaction
  const start = performance.now()

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const paymentReponse = await xrplClient.submitAndWait(signedTxn.tx_blob)

  console.log(color.bold("******* FINAL: Validated Transaction *******"))
  console.log(paymentReponse)
  console.log(color.bold("********************************************"))
  console.log("")

  // Check the end time to execute this transaction
  const end = performance.now()

  console.log(`Execution time: ${end - start} ms`)
  console.log("")
  console.log(`https://test.bithomp.com/${paymentReponse.result.Account}`)

  await xrplClient.disconnect()
}
