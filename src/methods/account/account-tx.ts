import { AccountTxRequest } from "xrpl"
import { MethodProps } from "../../models"

/**
 * https://xrpl.org/account_tx.html#account_tx
 */
export const getAccountTx = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountTxRequest>) => {
  const response = await client.request({
    command: "account_tx",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
