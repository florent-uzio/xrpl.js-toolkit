import { NFTSellOffersRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * https://xrpl.org/nft_buy_offers.html
 * @param {Object} props The nft buy offers fields.
 */
export const getNftBuyOffers = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<NFTSellOffersRequest>) => {
  // Send the request
  const response = await client.request({
    command: "nft_buy_offers",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
