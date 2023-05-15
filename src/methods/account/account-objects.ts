import { AccountObjectsRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getAccountObjects = async (props: AccountObjectsRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
}
