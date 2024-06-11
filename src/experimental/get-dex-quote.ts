import { BookOfferCurrency, BookOffersRequest, dropsToXrp } from "xrpl"
import { convertAmount, convertHexCurrencyCodeToString, isString } from "../helpers"
import { submitMethod } from "../methods"
import { MethodProps } from "../models"

type GetBuyQuoteProps = Omit<BookOffersRequest, "taker_gets" | "taker_pays" | "command"> & {
  /**
   * The currency we want to buy.
   * If the currency is an IOU, the issuer needs to be mentioned.
   */
  weWant: BookOfferCurrency
  /**
   * The amount of token we want to buy.
   */
  weWantAmountOfToken: number
  /**
   * The counter currency.
   */
  counterCurrency: BookOfferCurrency
}

/**
 * Function to get a quote of a token to buy.
 * This is an experimental function and must not be used in production without checking it does what you need.
 *
 * @param {Object} props The props to pass to the function.
 * @param {TakerAmount} props.weWant The token we want to acquire. Specify the currency and optionaly the issuer (if the currency is not XRP).
 * @param {number} props.weWantAmountOfToken The amount of token we want to acquire.
 * @param {string} props.taker (Optional) The Address of an account to use as a perspective. The response includes this account's Offers even if they are unfunded.
 * @param {TakerAmount} props.counterCurrency The counter currency.
 * @returns void, display a message regarding the result of the quote.
 */
export const getBuyQuote = async (
  { weWant, weWantAmountOfToken, counterCurrency, ...rest }: GetBuyQuoteProps,
  { client }: Pick<MethodProps<BookOffersRequest>, "client">,
): Promise<number> => {
  console.log("******* LET'S GET A BUY QUOTE *******")
  console.log()

  const offers = await submitMethod({
    request: {
      command: "book_offers",
      taker_gets: weWant,
      taker_pays: counterCurrency,
      ...rest,
    },
    client,
  })

  // Amount of remaining token we want to buy.
  let remaining = weWantAmountOfToken

  // Total amount of the opposite token we will sell.
  let total = 0

  for (const offer of offers.result.offers) {
    if (!offer.quality) break

    // Get the price for this offer.
    const offerPrice = +offer.quality

    // Get the amount of currency this offer is selling.
    let available = isString(offer.TakerGets)
      ? +dropsToXrp(offer.TakerGets)
      : +offer.TakerGets.value

    // If the available amount is more than what we want to exchange, add the corresponding total to our total.
    if (available > remaining) {
      const amountOfTokens = remaining * offerPrice

      total += amountOfTokens
      break
    }
    // Otherwise, add the total amount for this offer to our total and decrease the remaining amount.
    else {
      const amountOfTokens = available * offerPrice

      total += amountOfTokens

      remaining -= available
    }
  }

  if (counterCurrency.currency.toUpperCase() === "XRP") {
    total = +convertAmount({ amount: total, to: "xrp" })
  }

  if (weWant.currency.toUpperCase() === "XRP") {
    total = +convertAmount({ amount: total, to: "drops" })
  }

  const currencyReadable = convertHexCurrencyCodeToString(weWant.currency)
  const counterCurrencyReadable = convertHexCurrencyCodeToString(counterCurrency.currency)

  console.log(
    `You need to sell at least ${total} ${counterCurrencyReadable} to buy ${weWantAmountOfToken} ${currencyReadable}`,
  )

  return total
}

type GetSellQuoteProps = Omit<BookOffersRequest, "taker_gets" | "taker_pays" | "command"> & {
  /**
   * The currency we want to sell.
   * If the currency is an IOU, the issuer needs to be mentioned.
   */
  weSell: BookOfferCurrency
  /**
   * The amount of currency we want to sell.
   */
  weSellAmountOfTokens: number
  /**
   * The counter currency.
   */
  counterCurrency: BookOfferCurrency
}

/**
 * Function to get a quote of a token to sell.
 * The quote will give you the amount of the counter token that you can expect to get from that sell.
 * This is an experimental function and must not be used in production without checking it does what you need.
 *
 * @param {Object} props The props to pass to the function.
 * @param {TakerAmount} props.weSell The token we want to sell. Specify the currency and optionaly the issuer (if the currency is not XRP).
 * @param {number} props.weSellAmountOfTokens The amount of token we want to sell.
 * @param {string} props.taker (Optional) The Address of an account to use as a perspective. The response includes this account's Offers even if they are unfunded.
 * @param {TakerAmount} props.counterCurrency The counter currency.
 * @returns void, display a message regarding the result of the quote.
 */
export const getSellQuote = async (
  { weSell, weSellAmountOfTokens, counterCurrency, ...rest }: GetSellQuoteProps,
  { client }: Pick<MethodProps<BookOffersRequest>, "showLogs" | "client">,
): Promise<number> => {
  console.log("******* LET'S GET A SELL QUOTE *******")
  console.log()

  const offers = await submitMethod({
    request: {
      command: "book_offers",
      taker_gets: counterCurrency,
      taker_pays: weSell,
      ...rest,
    },
    client,
  })

  /** Amount of remaining token we want to sell. */
  let remaining = weSellAmountOfTokens

  // Total amount of the opposite token we will get.
  let total = 0

  // Loop through the offers
  for (const offer of offers.result.offers) {
    if (!offer.quality) break

    // Get the price for this offer.
    const offerPrice = +offer.quality

    /** The amount of currency this offer is buying. */
    let available = isString(offer.TakerPays)
      ? +convertAmount({ amount: offer.TakerPays, to: "xrp" })
      : +offer.TakerPays.value

    // If the available amount is more than what we want to exchange, add the corresponding total to our total.
    if (available > remaining) {
      const amountOfTokens = remaining / offerPrice
      total += amountOfTokens

      break
    }
    // Otherwise, add the total amount for this offer to our total and decrease the remaining amount.
    else {
      // amount of tokens to acquire
      const amountOfTokens = available / offerPrice

      total += amountOfTokens

      remaining -= available
    }
  }

  // Convert the total from drops to XRP if the counter currency is XRP
  if (counterCurrency.currency.toUpperCase() === "XRP") {
    total = +convertAmount({ amount: total, to: "xrp" })
  }

  // Multiply the total by a million to get a correct value
  if (weSell.currency.toUpperCase() === "XRP") {
    total = +convertAmount({ amount: total, to: "drops" })
  }

  const currencyReadable = convertHexCurrencyCodeToString(weSell.currency)
  const counterCurrencyReadable = convertHexCurrencyCodeToString(counterCurrency.currency)

  console.log(
    `You will get ${total} ${counterCurrencyReadable} if you sell ${weSellAmountOfTokens} ${currencyReadable}`,
  )

  return total
}
