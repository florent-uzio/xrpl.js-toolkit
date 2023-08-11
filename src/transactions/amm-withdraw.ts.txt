import color from "colors"
import { AMMWithdraw, xrpToDrops } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type AMMWithdrawProps = Omit<AMMWithdraw, "TransactionType" | "Account">

/**
 * Withdraw assets from an Automated Market Maker (AMM) instance by returning the AMM's liquidity provider tokens (LP Tokens).
 *
 * https://opensource.ripple.com/docs/xls-30d-amm/transaction-types/ammwithdraw/
 */
export const withdrawFromAMM = async (
  { Asset, Asset2, Amount, Amount2, ...rest }: AMMWithdrawProps,
  opts: TxnOptions
) => {
  console.log(color.bold("******* LET'S WITHDRAW FROM AN AMM *******"))
  console.log()

  // Convert the currencies to hex
  Asset.currency = convertCurrencyCodeToHex(Asset.currency)
  Asset2.currency = convertCurrencyCodeToHex(Asset2.currency)

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  } else if (Amount) {
    // Or the currency to hex
    Amount.currency = convertCurrencyCodeToHex(Amount.currency)
  }

  // Convert the amount2 to drops (1 drop = .000001 XRP)
  if (typeof Amount2 === "string") {
    Amount2 = xrpToDrops(Amount2)
  } else if (Amount2) {
    // Or the currency to hex
    Amount2.currency = convertCurrencyCodeToHex(Amount2.currency)
  }

  // Construct the base transaction
  const transaction: AMMWithdraw = {
    TransactionType: "AMMWithdraw",
    Account: opts.wallet.address,
    Asset,
    Asset2,
    Amount,
    Amount2,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
