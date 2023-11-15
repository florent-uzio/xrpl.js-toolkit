import { Transaction } from "xrpl"
import { TxnOptions } from "../models"

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
  { client, isMultisign, showLogs, wallet }: Omit<TxnOptions, "signatures">,
  signers: number,
) => {
  const prepared = await client.autofill(transaction, signers)

  const signature = wallet.sign(prepared, isMultisign)

  if (showLogs) {
    console.log(signature)
  }

  return signature
}
