import color from "colors"
import { AMMBid } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../../helpers"
import { TxnOptions } from "../../models"

type AMMBidProps = Omit<AMMBid, "TransactionType" | "Account">

/**
 * https://opensource.ripple.com/docs/xls-30d-amm/transaction-types/ammbid/
 *
 * Bid on an Automated Market Maker's (AMM's) auction slot. If you win, you can trade against the AMM at a discounted
 * fee until you are outbid or 24 hours have passed.
 * If you are outbid before 24 hours have passed, you are refunded part of the cost of your bid based on how much time remains.
 *
 * You bid using the AMM's LP Tokens; the amount of a winning bid is returned to the AMM, decreasing the outstanding balance of LP Tokens.
 */
export const bidAMM = async ({ Asset, Asset2, ...rest }: AMMBidProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S BID IN AN AMM *******"))
  console.log()

  // Convert the currencies to hex
  Asset.currency = convertCurrencyCodeToHex(Asset.currency)
  Asset2.currency = convertCurrencyCodeToHex(Asset2.currency)

  // Construct the base transaction
  const transaction: AMMBid = {
    TransactionType: "AMMBid",
    Account: opts.wallet.address,
    Asset,
    Asset2,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
