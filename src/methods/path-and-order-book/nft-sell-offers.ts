import { NFTSellOffersRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * https://xrpl.org/nft_sell_offers.html#nft_sell_offers
 * @param {Object} props The nft sell offers fields.
 */
export const getNftSellOffers = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<NFTSellOffersRequest>) => {
  // Send the request
  const response = await client.request({
    command: "nft_sell_offers",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
