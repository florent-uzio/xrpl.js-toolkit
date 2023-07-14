import { NFTInfoRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

/**
 * The nft_info command asks the Clio server for information about the NFT being queried.
 *
 * https://xrpl.org/nft_info.html
 */
export const getNftInfo = async (props: Omit<NFTInfoRequest, "command">) => {
  // Send the request
  const response = await getXrplClient().request({ command: "nft_info", ...props })
  console.log(JSON.stringify(response, undefined, 2))
}
