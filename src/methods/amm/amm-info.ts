import { AMMInfoRequest } from "xrpl"
import { convertCurrencyCodeToHex } from "../../helpers"
import { MethodProps } from "../../models"

export const getAMMInfo = async ({
  client,
  methodRequest,
  showLogs,
}: MethodProps<AMMInfoRequest>) => {
  const { asset, asset2, ...rest } = methodRequest as AMMInfoRequest

  if (asset && asset.currency !== "XRP") {
    asset.currency = convertCurrencyCodeToHex(asset.currency)
  }

  if (asset2 && asset2.currency !== "XRP") {
    asset2.currency = convertCurrencyCodeToHex(asset2.currency)
  }

  // Send the request
  const response = await client.request({ asset, asset2, ...rest })
  console.log(JSON.stringify(response, undefined, 2))
}
