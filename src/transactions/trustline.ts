import color from "colors"
import { TrustSet } from "xrpl"
import { OptionalExceptFor, convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"
import { xrplClient } from "../xrpl-client"

type CreateTrustlineProps = Omit<OptionalExceptFor<TrustSet, "LimitAmount">, "TransactionType">

export const createTrustline = async (
  { LimitAmount, ...rest }: CreateTrustlineProps,
  opts: TxnOptions
) => {
  console.log(color.bold("******* LET'S CREATE A TRUSTLINE *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: TrustSet = {
    Account: opts.wallet.address,
    TransactionType: "TrustSet",
    LimitAmount: {
      ...LimitAmount,
      currency: convertCurrencyCodeToHex(LimitAmount.currency),
    },
    ...rest,
  }

  // Autofill transaction with additional fields (such as LastLedgerSequence), sign and submit
  await prepareSignSubmit(transaction, opts)

  await xrplClient.disconnect()
}
