import { NFTHistoryRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * The nft_info command asks the Clio server for information about the NFT being queried.
 *
 * https://xrpl.org/nft_history.html
 */
export const getNftHistory = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<NFTHistoryRequest>) => {
  // Send the request
  const response = await client.request({ command: "nft_history", ...methodRequest })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
