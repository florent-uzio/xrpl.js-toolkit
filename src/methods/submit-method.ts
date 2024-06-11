import { Request } from "xrpl"
import {
  ReplacementFn,
  convertCurrencyCodeToHex,
  convertHexCurrencyCodeToString,
  deepReplace,
} from "../helpers"
import { MethodProps } from "../models"

export const submitMethod = async <T extends Request>({
  client,
  request,
  showLogs = true,
}: MethodProps<T>) => {
  // Update the currency in case it has more than 3 characters
  const updatedRequest: T = deepReplace(request, "currency", (key, value) => {
    return { [key]: convertCurrencyCodeToHex(value) }
  })

  const response = await client.request(updatedRequest)

  // Update fields in the console.log only
  let updatedResponse = deepReplace(response, "send_currencies", hexToStringCurrency)

  updatedResponse = deepReplace(updatedResponse, "receive_currencies", hexToStringCurrency)

  updatedResponse = deepReplace(updatedResponse, "currency", hexToStringCurrency)

  if (showLogs) {
    console.log(JSON.stringify(updatedResponse, undefined, 2))
  }

  return response
}

// Convert the currency as hex to readable string
const hexToStringCurrency: ReplacementFn = (key, value) => {
  if (Array.isArray(value)) {
    const newValues = value.map((val) => convertHexCurrencyCodeToString(val))
    console.log(newValues)
    return { [key]: newValues }
  }
  return { [key]: convertHexCurrencyCodeToString(value) }
}
