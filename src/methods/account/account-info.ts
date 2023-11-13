import { AccountInfoRequest, AccountInfoResponse } from "xrpl"
import { MethodProps } from "../../models"

export const getAccountInfo = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountInfoRequest>) => {
  // Send the request
  const response: AccountInfoResponse = await client.request({
    command: "account_info",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
