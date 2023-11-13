import { NFTInfoRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * The nft_info command asks the Clio server for information about the NFT being queried.
 *
 * https://xrpl.org/nft_info.html
 */
export const getNftInfo = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<NFTInfoRequest>) => {
  // Send the request
  const response = await client.request({ command: "nft_info", ...methodRequest })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
