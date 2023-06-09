import color from "colors"
import { dropsToXrp } from "xrpl"
import { BookOffersRequest, TakerAmount } from "xrpl/dist/npm/models/methods/bookOffers"
import { getBookOffers } from "../methods"
import { MethodOptions } from "../models"
import { convertAmount } from "./amounts.helpers"
import { convertHexCurrencyCodeToString } from "./currency-code.helpers"
import { DataTable, createDataTable } from "./loggers"
import { isString } from "./typeof-fns"

type GetBuyQuoteProps = Pick<BookOffersRequest, "taker"> & {
  /**
   * The currency we want to buy.
   * If the currency is an IOU, the issuer needs to be mentioned.
   */
  weWant: TakerAmount
  /**
   * The amount of token we want to buy.
   */
  weWantAmountOfToken: string
  /**
   * The counter currency.
   */
  counterCurrency: TakerAmount
}

export const getBuyQuote = async (
  { weWant, weWantAmountOfToken, counterCurrency, taker }: GetBuyQuoteProps,
  { showLogs }: MethodOptions = {}
): Promise<number> => {
  const offers = await getBookOffers(
    {
      command: "book_offers",
      taker_gets: weWant,
      taker_pays: counterCurrency,
      taker,
    },
    { showLogs }
  )

  // Amount of remaining token we want to buy.
  let remaining = +weWantAmountOfToken

  // Total amount of the opposite token we will sell.
  let total = 0

  const currencyWeWantReadable = convertHexCurrencyCodeToString(weWant.currency)
  const counterCurrencyReadable = convertHexCurrencyCodeToString(counterCurrency.currency)

  const header1 = "Offer Sequence"
  const header2 = `${currencyWeWantReadable} ready to be sold in that offer`
  const header3 = `Amount of ${currencyWeWantReadable} we still need to buy`
  const header4 = `Amount of ${counterCurrencyReadable} to sell for that purchase`

  // to display info in the console
  const dataTable: DataTable = createDataTable([header1, header2, header3, header4])

  // index to update the data table later
  let rowIndex = 0

  for (const offer of offers.result.offers) {
    if (!offer.quality) break

    // Get the price for this offer.
    const offerPrice = +offer.quality

    // Get the amount of currency this offer is selling.
    let available = isString(offer.TakerGets)
      ? +dropsToXrp(offer.TakerGets)
      : +offer.TakerGets.value

    // Information to display in the console
    dataTable.addRow({
      [header1]: offer.Sequence,
      [header2]: available,
      [header3]: remaining,
      [header4]: "",
    })

    // If the available amount is more than what we want to exchange, add the corresponding total to our total.
    if (available > remaining) {
      const amountOfTokens = remaining * offerPrice

      dataTable.updateCellValue(
        rowIndex,
        header4,
        counterCurrencyReadable.toUpperCase() === "XRP"
          ? +convertAmount({ amount: amountOfTokens.toString(), to: "xrp" })
          : amountOfTokens
      )

      total += amountOfTokens
      break
    }
    // Otherwise, add the total amount for this offer to our total and decrease the remaining amount.
    else {
      // amount of tokens to sell
      const amountOfTokens = available * offerPrice

      dataTable.updateCellValue(
        rowIndex,
        header4,
        counterCurrencyReadable.toUpperCase() === "XRP"
          ? +convertAmount({ amount: amountOfTokens.toString(), to: "xrp" })
          : amountOfTokens
      )
      total += amountOfTokens

      remaining -= available
    }
    rowIndex++
  }

  if (counterCurrency.currency.toUpperCase() === "XRP") {
    total = +dropsToXrp(total)
  }

  // Show results in terminal
  console.log()
  console.log(`Total amount of ${currencyWeWantReadable} to sell: ${weWantAmountOfToken}`)

  console.log()
  dataTable.printTable()
  console.log()

  console.log(
    color.bold(
      `You need to sell at least ${total} ${counterCurrency.currency} to buy ${weWantAmountOfToken} ${currencyWeWantReadable}`
    )
  )

  return total
}

type GetSellQuoteProps = Pick<BookOffersRequest, "taker"> & {
  /**
   * The currency we want to sell.
   * If the currency is an IOU, the issuer needs to be mentioned.
   */
  weSell: TakerAmount
  /**
   * The amount of currency we want to sell.
   */
  weSellAmount: string
  /**
   * The counter currency.
   */
  counterCurrency: TakerAmount
}

/**
 * Function to get a quote when we want to sell a token.
 * The quote will give you the amount of the counter token that you can expect to get from that sell.
 */
export const getSellQuote = async (
  { weSell, weSellAmount, counterCurrency, taker }: GetSellQuoteProps,
  { showLogs }: MethodOptions = {}
): Promise<number> => {
  const offers = await getBookOffers(
    {
      command: "book_offers",
      taker_gets: counterCurrency,
      taker_pays: weSell,
      taker,
    },
    { showLogs }
  )

  /** Amount of remaining token we want to sell. */
  let remaining = +weSellAmount

  // Total amount of the opposite token we will get.
  let total = 0

  const currencyWeSellReadable = convertHexCurrencyCodeToString(weSell.currency)
  const counterCurrencyReadable = counterCurrency.currency

  const header1 = "Offer Sequence"
  const header2 = `${currencyWeSellReadable} ready to be bought in that offer`
  const header3 = `Amount of ${currencyWeSellReadable} we still need to sell`
  const header4 = `Amount of ${counterCurrencyReadable} to get with that sell`

  // to display info in the console
  const dataTable: DataTable = createDataTable([header1, header2, header3, header4])

  let rowIndex = 0

  // Loop through the offers
  for (const offer of offers.result.offers) {
    if (!offer.quality) break

    // Get the price for this offer.
    const offerPrice = +offer.quality

    /** The amount of currency this offer is buying. */
    let available = isString(offer.TakerPays)
      ? +dropsToXrp(offer.TakerPays)
      : +offer.TakerPays.value

    // Information to display in the console
    dataTable.addRow({
      [header1]: offer.Sequence,
      [header2]: available,
      [header3]: remaining,
      [header4]: "",
    })

    // If the available amount is more than what we want to exchange, add the corresponding total to our total.
    if (available > remaining) {
      const amountOfTokens = remaining / offerPrice

      dataTable.updateCellValue(
        rowIndex,
        header4,
        counterCurrencyReadable.toUpperCase() === "XRP"
          ? +dropsToXrp(amountOfTokens)
          : amountOfTokens
      )

      total += amountOfTokens

      break
    }
    // Otherwise, add the total amount for this offer to our total and decrease the remaining amount.
    else {
      // amount of tokens to acquire
      const amountOfTokens = available / offerPrice

      // For display in the console
      dataTable.updateCellValue(
        rowIndex,
        header4,
        counterCurrencyReadable.toUpperCase() === "XRP"
          ? +dropsToXrp(amountOfTokens)
          : amountOfTokens
      )

      total += amountOfTokens

      remaining -= available
    }
    rowIndex++
  }

  // Convert the total from drops to XRP if the counter currency is XRP
  if (counterCurrency.currency.toUpperCase() === "XRP") {
    total = +dropsToXrp(total)
  }

  // Show results in terminal
  console.log()
  console.log(
    `Total amount of ${convertHexCurrencyCodeToString(weSell.currency)} to sell: ${weSellAmount}`
  )

  console.log()
  dataTable.printTable()
  console.log()

  console.log(
    color.bold(
      `You will get ${total} ${
        counterCurrency.currency
      } if you sell ${weSellAmount} ${convertHexCurrencyCodeToString(weSell.currency)}`
    )
  )

  return total
}
