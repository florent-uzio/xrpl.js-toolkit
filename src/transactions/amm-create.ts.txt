import color from "colors"
import { AMMCreate, xrpToDrops } from "xrpl"
import { convertCurrencyCodeToHex, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type AMMCreateProps = Omit<AMMCreate, "TransactionType" | "Account">

/**
 * Create a new Automated Market Maker (AMM) instance for trading a pair of assets (fungible tokens or XRP).
 *
 * Creates both an AMM object and a special AccountRoot object to represent the AMM.
 * Also transfers ownership of the starting balance of both assets from the sender to the
 * created AccountRoot and issues an initial balance of liquidity provider tokens (LP Tokens) from the AMM account to the sender.
 *
 * Caution: When you create the AMM, you should fund it with (approximately) equal-value amounts of each asset.
 * Otherwise, other users can profit at your expense by trading with this AMM (performing arbitrage).
 * The currency risk that liquidity providers take on increases with the volatility (potential for imbalance) of the asset pair.
 * The higher the trading fee, the more it offsets this risk, so it's best to set the trading fee based on the volatility of the asset pair.
 *
 * https://opensource.ripple.com/docs/xls-30d-amm/transaction-types/ammcreate/
 */
export const createAMM = async ({ Amount, Amount2, ...rest }: AMMCreateProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S CREATE AN AMM *******"))
  console.log()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof Amount === "string") {
    Amount = xrpToDrops(Amount)
  } else {
    // Or convert the currency to hex
    Amount.currency = convertCurrencyCodeToHex(Amount.currency)
  }

  // Convert the 2nd amount to drops (1 drop = .000001 XRP)
  if (typeof Amount2 === "string") {
    Amount2 = xrpToDrops(Amount2)
  } else {
    // Or convert the currency to hex
    Amount2.currency = convertCurrencyCodeToHex(Amount2.currency)
  }

  // Construct the base transaction
  const transaction: AMMCreate = {
    TransactionType: "AMMCreate",
    Account: opts.wallet.address,
    Amount,
    Amount2,
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
