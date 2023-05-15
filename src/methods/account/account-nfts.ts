import { AccountNFTsRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getAccountNfts = async (props: AccountNFTsRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
}
