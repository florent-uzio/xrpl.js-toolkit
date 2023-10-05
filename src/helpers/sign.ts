import { Transaction } from "xrpl"
import { TxnOptions } from "../models"
import { getXrplClient } from "../xrpl-client"

const client = getXrplClient()

/**
 * Helper to sign a transaction
 *
 * @param {Transaction} transaction The xrpl transaction (Payment, TrustSet...)
 * @param {Object} opts Object containing different options
 * @param {number} signers Number of signers
 * @returns
 */
export const sign = async (
  transaction: Transaction,
  { wallet, isMultisign, showLogs }: Omit<TxnOptions, "signatures">,
  signers: number,
) => {
  const prepared = await client.autofill(transaction, signers)

  const signature = wallet.sign(prepared, isMultisign)

  if (showLogs) {
    console.log(signature)
  }

  return signature
}
