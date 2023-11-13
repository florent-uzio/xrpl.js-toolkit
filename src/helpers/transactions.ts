import { Client, Transaction, multisign } from "xrpl"
import { TxnOptions } from "../models"
import { log } from "./loggers"

export const prepareSignSubmit = async (
  transaction: Transaction,
  { client, wallet, showLogs = true }: TxnOptions,
) => {
  // Autofill transaction with additional fields (such as LastLedgerSequence).
  const preparedTxn = await client.autofill(transaction)

  log("Prepared Transaction", preparedTxn, showLogs)

  // Sign the transaction
  const signedTxn = wallet.sign(preparedTxn)

  log("Signed Transaction", signedTxn, showLogs)

  // Start calculating the time to submit and validate this transaction
  const start = performance.now()

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const response = await client.submitAndWait(signedTxn.tx_blob)

  log("FINAL: Validated Transaction", response, showLogs)

  // Check the end time to execute this transaction
  const end = performance.now()

  if (showLogs) {
    console.log(`Execution time: ${end - start} ms`)
    console.log()
    console.log(getFinalLogUrl(transaction))
  }
}

const getFinalLogUrl = (transaction: Transaction) => {
  const { TransactionType, Account } = transaction

  const isNftTxn =
    TransactionType === "NFTokenMint" ||
    TransactionType === "NFTokenBurn" ||
    TransactionType === "NFTokenCancelOffer" ||
    TransactionType === "NFTokenCreateOffer"

  return `https://test.bithomp.com/${isNftTxn ? `nfts/${Account}` : Account}`
}

/**
 * Helper to concatenate the signatures for a multisign transaction and submit the concatenation to the XRPL.
 *
 * @param {string[]} signatures All the signatures gathered for the multisign transaction.
 */
export const multiSignAndSubmit = async (signatures: string[], client: Client) => {
  const multiSignatures = multisign(signatures)

  const response = await client.submitAndWait(multiSignatures)

  console.log(response)
}
