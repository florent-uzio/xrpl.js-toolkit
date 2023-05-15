import * as xrpl from "xrpl"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"
import { log } from "./loggers"

export const prepareSignSubmit = async (
  transaction: xrpl.Transaction,
  { wallet, showLogs = true }: TxnOptions
) => {
  // Autofill transaction with additional fields (such as LastLedgerSequence).
  const preparedTxn = await xrplClient.autofill(transaction)

  log("Prepared Transaction", preparedTxn, showLogs)

  // Sign the transaction
  const signedTxn = wallet.sign(preparedTxn)

  log("Signed Transaction", signedTxn, showLogs)

  // Start calculating the time to submit and validate this transaction
  const start = performance.now()

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const response = await xrplClient.submitAndWait(signedTxn.tx_blob)

  log("FINAL: Validated Transaction", response, showLogs)

  // Check the end time to execute this transaction
  const end = performance.now()

  if (showLogs) {
    console.log(`Execution time: ${end - start} ms`)
    console.log()
    console.log(getFinalLogUrl(transaction))
  }
}

const getFinalLogUrl = (transaction: xrpl.Transaction) => {
  const { TransactionType, Account } = transaction

  const isNftTxn =
    TransactionType === "NFTokenMint" ||
    TransactionType === "NFTokenBurn" ||
    TransactionType === "NFTokenCancelOffer" ||
    TransactionType === "NFTokenCreateOffer"

  return `https://test.bithomp.com/${isNftTxn ? `nfts/${Account}` : Account}`
}
