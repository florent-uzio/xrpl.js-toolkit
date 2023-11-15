import { ChannelVerifyRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * The channel_verify method checks the validity of a signature that can be used to redeem a specific amount of XRP from a payment channel.
 * https://xrpl.org/channel_verify.html#channel_verify
 */
export const channelVerify = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<ChannelVerifyRequest>) => {
  const response = await client.request({
    command: "channel_verify",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
