import { LedgerEntryRequest } from "xrpl"
import { getXrplClient } from "../../xrpl-client"

export const getLedgerEntry = async (props: LedgerEntryRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)
  console.log(JSON.stringify(response, undefined, 2))
}
