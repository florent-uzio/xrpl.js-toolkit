import { AccountCurrenciesRequest } from "xrpl"
import { convertHexCurrencyCodeToString } from "../../helpers"
import { getXrplClient } from "../../xrpl-client"

export const getAccountCurrencies = async (props: AccountCurrenciesRequest) => {
  // Send the request
  const response = await getXrplClient().request(props)

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

  console.log(JSON.stringify(response, undefined, 2))
}
