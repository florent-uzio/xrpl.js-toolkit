import { BookOffersRequest } from "xrpl"
import { convertCurrencyCodeToHex } from "../../helpers"
import { MethodProps } from "../../models"

/**
 * https://xrpl.org/book_offers.html
 * @param {Object} props The book offers fields.
 */
export const getBookOffers = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<BookOffersRequest>) => {
  const { taker_gets, taker_pays } = methodRequest as BookOffersRequest

  // Convert currencies to hex if needed
  taker_gets.currency = convertCurrencyCodeToHex(taker_gets.currency)
  taker_pays.currency = convertCurrencyCodeToHex(taker_pays.currency)

  // Send the request
  const response = await client.request({
    command: "book_offers",
    taker_gets,
    taker_pays,
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }
  return response
}
