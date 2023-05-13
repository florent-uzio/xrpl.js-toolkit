import { AccountNFTsRequest } from "xrpl"
import { xrplClient } from "../../xrpl-client"

export const getAccountNfts = async (props: AccountNFTsRequest) => {
  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Send the request
  const response = await xrplClient.request(props)
  console.log(JSON.stringify(response, undefined, 2))

  await xrplClient.disconnect()
}
