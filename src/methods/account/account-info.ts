import { AccountInfoRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getAccountInfo = async (props: AccountInfoRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
}
