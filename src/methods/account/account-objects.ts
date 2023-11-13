import { AccountObjectsRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getAccountObjects = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountObjectsRequest>) => {
  const response = await client.request({
    command: "account_objects",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
