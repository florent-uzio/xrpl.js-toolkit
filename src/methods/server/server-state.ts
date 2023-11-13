import { ServerStateRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getServerState = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<ServerStateRequest>) => {
  // Send the request
  const response = await client.request({
    command: "server_state",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
