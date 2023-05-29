import color from "colors"
import { AMMVote } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type AMMVoteProps = Omit<AMMVote, "TransactionType" | "Account">

/**
 * Vote on the trading fee for an Automated Market Maker instance.
 * Up to 8 accounts can vote in proportion to the amount of the AMM's LP Tokens they hold.
 * Each new vote re-calculates the AMM's trading fee based on a weighted average of the votes.
 *
 * https://opensource.ripple.com/docs/xls-30d-amm/transaction-types/ammwithdraw/
 */
export const voteInAMM = async ({ Asset, Asset2, ...rest }: AMMVoteProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S VOTE IN AN AMM *******"))
  console.log()

  // Convert the currencies to hex
  Asset.currency = convertCurrencyCodeToHex(Asset.currency)
  Asset2.currency = convertCurrencyCodeToHex(Asset2.currency)

  // Construct the base transaction
  const transaction: AMMVote = {
    TransactionType: "AMMVote",
    Account: opts.wallet.address,
    Asset,
    Asset2,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
