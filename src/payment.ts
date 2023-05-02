import color from "colors"
import * as xrpl from "xrpl"
import { Amount } from "xrpl/dist/npm/models/common"
import { xrplClient } from "./xrpl-client"

type SendPaymentProps = {
  Destination: string
  Amount: Amount
  wallet: xrpl.Wallet
}

export const sendPayment = async ({ Destination, Amount, wallet }: SendPaymentProps) => {
  // Connect to the XRP Ledger
  await xrplClient.connect()

  if (typeof Amount === "string") {
    Amount = xrpl.xrpToDrops(Amount)
  }

  // Construct the base payment transaction
  const paymentTxn: xrpl.Payment = {
    TransactionType: "Payment",
    Account: wallet.address,
    Destination,
    Amount,
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

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const paymentReponse = await xrplClient.submitAndWait(signedTxn.tx_blob)

  console.log(color.bold("******* FINAL: Validated Transaction *******"))
  console.log(paymentReponse)
  console.log(color.bold("********************************************"))

  await xrplClient.disconnect()
}
