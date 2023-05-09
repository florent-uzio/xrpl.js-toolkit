import * as xrpl from "xrpl"
import { xrplClient } from "../xrpl-client"
import { log } from "./loggers"

export const prepareSignSubmit = async (transaction: xrpl.Transaction, wallet: xrpl.Wallet) => {
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
  console.log()
  console.log(getFinalLogUrl(transaction))
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
