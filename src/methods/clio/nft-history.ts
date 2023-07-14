import { NFTHistoryRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

/**
 * The nft_info command asks the Clio server for information about the NFT being queried.
 *
 * https://xrpl.org/nft_history.html
 */
export const getNftHistory = async (props: Omit<NFTHistoryRequest, "command">) => {
  // Send the request
  const response = await getXrplClient().request({ command: "nft_history", ...props })
  console.log(JSON.stringify(response, undefined, 2))
}
