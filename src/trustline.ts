import color from "colors"
import { TrustSet } from "xrpl"
import { OptionalExceptFor, convertCurrencyCodeToHex, log } from "./helpers"
import { TxnOptions } from "./models"
import { xrplClient } from "./xrpl-client"

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

  // Autofill transaction with additional fields (such as LastLedgerSequence).
  const preparedTxn = await xrplClient.autofill(transaction)

  log("Prepared Transaction", preparedTxn)

  // Sign the transaction
  const signedTxn = wallet.sign(preparedTxn)

  log("Signed Transaction", signedTxn)

  // Start calculating the time to submit and validate this transaction
  const start = performance.now()

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const response = await xrplClient.submitAndWait(signedTxn.tx_blob)

  log("FINAL: Validated Transaction", response)

  // Check the end time to execute this transaction
  const end = performance.now()

  console.log(`Execution time: ${end - start} ms`)
  console.log("")
  console.log(`https://test.bithomp.com/${response.result.Account}`)

  await xrplClient.disconnect()
}
