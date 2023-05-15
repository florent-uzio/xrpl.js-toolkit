import { AccountLinesRequest } from "xrpl"
import { convertHexCurrencyCodeToString } from "../../helpers"
import { getXrplClient } from "../../xrpl-client"

export const getAccountLines = async (props: AccountLinesRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)

  // Destructuring
  const { lines } = response.result

  // convert the line currency with more than 3 characters to a human readable string
  response.result.lines = lines.map((line) => {
    if (line.currency.length > 3) {
      return {
        ...line,
        currency: convertHexCurrencyCodeToString(line.currency),
      }
    }
    return line
  })

  console.log(JSON.stringify(response, undefined, 2))
}
