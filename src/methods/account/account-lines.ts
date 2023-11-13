import { AccountLinesRequest, AccountLinesResponse } from "xrpl"
import { convertHexCurrencyCodeToString } from "../../helpers"
import { MethodProps } from "../../models"

export const getAccountLines = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountLinesRequest>) => {
  // Send the request
  const response: AccountLinesResponse = await client.request({
    command: "account_lines",
    ...methodRequest,
  })

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

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
