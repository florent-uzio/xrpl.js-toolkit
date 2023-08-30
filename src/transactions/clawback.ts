import color from "colors"
import { Clawback } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type ClawbackProps = Omit<Clawback, "TransactionType" | "Account">

/**
 * !!!! As of 30th of August, it is only available on Devnet !!!!
 * Make sure to choose the Devnet network in src/xrpl-client.ts
 *
 * Steps for the clawback to work:
 * 1. Enable clawback for issuer with an AccountSet and set the flag AccountSetAsfFlags.asfAllowTrustLineClawback
 * 2. Create a trustline to the issuer with your holder account (TrustSet)
 * 3. Transfer the issued token from the issuer to the holder (Payment transaction)
 * 4. Use this clawback function by specifying the following Clawback transaction type, for example:
 * {
 *   TransactionType: "Clawback",
 *   Account: issuer.classicAddress,
 *   Amount: {
 *      currency: "EUR",
 *      issuer: holder.classicAddress, // <---- Here define the holder address !!
 *      value: "700",
 *   },
 * }
 */
export const clawback = async ({ Amount, ...rest }: ClawbackProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CLAWBACK FUNDS *******"))
  console.log()

  Amount.currency = convertCurrencyCodeToHex(Amount.currency)

  // Construct the base transaction
  const transaction: Clawback = {
    TransactionType: "Clawback",
    Account: opts.wallet.address,
    Amount,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
