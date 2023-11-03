import color from "colors"
import { AMMDeposit, xrpToDrops } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../../helpers"
import { TxnOptions } from "../../models"

type AMMDepositProps = Omit<AMMDeposit, "TransactionType" | "Account">

/**
 * Deposit funds into an Automated Market Maker (AMM) instance and receive the AMM's
 * liquidity provider tokens (LP Tokens) in exchange. You can deposit one or both of the assets in the AMM's pool.
 *
 * If successful, this transaction creates a trust line to the AMM Account (limit 0) to hold the LP Tokens.
 *
 * https://opensource.ripple.com/docs/xls-30d-amm/transaction-types/ammdeposit/
 */
export const depositInAMM = async (
  { Asset, Asset2, Amount2, Amount, ...rest }: AMMDepositProps,
  opts: TxnOptions,
) => {
  console.log(color.bold("******* LET'S DEPOSIT IN AN AMM *******"))
  console.log()

  // Convert the currencies to hex
  Asset.currency = convertCurrencyCodeToHex(Asset.currency)
  Asset2.currency = convertCurrencyCodeToHex(Asset2.currency)

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  } else if (Amount) {
    Amount.currency = convertCurrencyCodeToHex(Amount.currency)
  }

  // Convert the amount2 to drops (1 drop = .000001 XRP)
  if (typeof Amount2 === "string") {
    Amount2 = xrpToDrops(Amount2)
  } else if (Amount2) {
    Amount2.currency = convertCurrencyCodeToHex(Amount2.currency)
  }

  // Construct the base transaction
  const transaction: AMMDeposit = {
    TransactionType: "AMMDeposit",
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
