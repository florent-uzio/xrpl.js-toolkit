import { GatewayBalancesRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getGatewayBalances = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<GatewayBalancesRequest>) => {
  const response = await client.request({
    command: "gateway_balances",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
