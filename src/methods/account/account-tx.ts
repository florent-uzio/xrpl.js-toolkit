import { AccountTxRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

/**
 * https://xrpl.org/account_tx.html#account_tx
 */
export const getAccountTx = async (props: AccountTxRequest) => {
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
  return response
}
