import { AccountChannelsRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

const client = getXrplClient()

export const getAccountChannels = async (props: AccountChannelsRequest) => {
  const response = await client.request(props)
  console.log(JSON.stringify(response, undefined, 2))
  return response
}
