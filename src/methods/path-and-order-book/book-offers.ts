import { BookOffersRequest } from "xrpl"
import { convertCurrencyCodeToHex } from "../../helpers"
import { getXrplClient } from "../../xrpl-client"

/**
 * https://xrpl.org/book_offers.html
 * @param {Object} props The book offers fields.
 */
export const getBookOffers = async ({ taker_gets, taker_pays, ...rest }: BookOffersRequest) => {
  // Convert currencies to hex if needed
  taker_gets.currency = convertCurrencyCodeToHex(taker_gets.currency)
  taker_pays.currency = convertCurrencyCodeToHex(taker_pays.currency)

  // Send the request
  const response = await getXrplClient().request({
    taker_gets,
    taker_pays,
    ...rest,
  })

  console.log(JSON.stringify(response, undefined, 2))
}
