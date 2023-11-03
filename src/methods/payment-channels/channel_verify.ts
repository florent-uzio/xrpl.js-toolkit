import { ChannelVerifyRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

const client = getXrplClient()

/**
 * The channel_verify method checks the validity of a signature that can be used to redeem a specific amount of XRP from a payment channel.
 * https://xrpl.org/channel_verify.html#channel_verify
 */
export const channelVerify = async (props: ChannelVerifyRequest) => {
  const response = await client.request(props)
  console.log(JSON.stringify(response, undefined, 2))
  return response
}
