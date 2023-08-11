import { AccountOffersRequest, GatewayBalancesRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getGatewayBalances = async (props: Omit<GatewayBalancesRequest, "command"> = {}) => {
  const response = await getXrplClient().request({ ...props, command: "gateway_balances" })
  console.log(JSON.stringify(response, undefined, 2))

  return response
}
