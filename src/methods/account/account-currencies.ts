import { AccountCurrenciesRequest, AccountCurrenciesResponse } from "xrpl"
import { convertHexCurrencyCodeToString } from "../../helpers"
import { MethodProps } from "../../models"

export const getAccountCurrencies = async ({
  methodRequest,
  client,
  showLogs = true,
}: MethodProps<AccountCurrenciesRequest>) => {
  // Send the request
  const response: AccountCurrenciesResponse = await client.request({
    command: "account_currencies",
    ...methodRequest,
  })

  // Destructuring
  let { receive_currencies, send_currencies } = response.result

  // convert the receive_currencies with more than 3 characters to a human readable string
  response.result.receive_currencies = receive_currencies.map((currency) => {
    if (currency.length > 3) {
      return convertHexCurrencyCodeToString(currency)
    }
    return currency
  })

  // convert the send_currencies with more than 3 characters to a human readable string
  response.result.send_currencies = send_currencies.map((currency) => {
    if (currency.length > 3) {
      return convertHexCurrencyCodeToString(currency)
    }
    return currency
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }
}
