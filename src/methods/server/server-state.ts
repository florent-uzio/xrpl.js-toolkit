import { ServerStateRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getServerState = async (props?: Omit<ServerStateRequest, "command">) => {
  // Send the request
  const response = await getXrplClient().request({
    command: "server_state",
    ...props,
  })
  console.log(JSON.stringify(response, undefined, 2))
}
