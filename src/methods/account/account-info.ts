import { AccountInfoRequest } from "xrpl"
import { xrplClient } from "../../xrpl-client"

export const getAccountInfo = async (props: AccountInfoRequest) => {
  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Send the request
  const response = await xrplClient.request(props)
  console.log(JSON.stringify(response, undefined, 2))

  await xrplClient.disconnect()
}
