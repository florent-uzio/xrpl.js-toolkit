import { TxRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * The account_channels method returns information about an account's Payment Channels.
 * This includes only channels where the specified account is the channel's source, not the destination.
 * (A channel's "source" and "owner" are the same.) All information retrieved is relative to a particular version of the ledger.
 *
 * https://xrpl.org/account_channels.html
 */
export const getTx = async ({ client, methodRequest, showLogs = true }: MethodProps<TxRequest>) => {
  const response = await client.request({
    command: "tx",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
