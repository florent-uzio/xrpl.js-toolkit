import { Request, RequestResponseMap } from "xrpl"
import {
  ReplacementFn,
  convertCurrencyCodeToHex,
  convertHexCurrencyCodeToString,
  deepReplace,
} from "../helpers"
import { MethodProps } from "../models"

export async function submitMethod<T extends Request>(
  props: MethodProps<T> & { run: false },
): Promise<undefined>
export async function submitMethod<T extends Request>(
  props: MethodProps<T> & { run?: true },
): Promise<RequestResponseMap<T, 2>>
export async function submitMethod<T extends Request>({
  client,
  request,
  showLogs = true,
  run = true,
}: MethodProps<T>) {
  if (!run) {
    if (!showLogs) {
      console.log("Request submission skipped as 'run' is set to false")
    }
    return
  }

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
    return { [key]: newValues }
  }
  return { [key]: convertHexCurrencyCodeToString(value) }
}
