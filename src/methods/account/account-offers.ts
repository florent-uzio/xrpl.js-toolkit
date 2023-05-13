import { AccountOffersRequest } from "xrpl"
import { xrplClient } from "../../xrpl-client"

export const getAccountOffers = async (props: AccountOffersRequest) => {
  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Send the request
  const response = await xrplClient.request(props)
  console.log(JSON.stringify(response, undefined, 2))

  await xrplClient.disconnect()
}
