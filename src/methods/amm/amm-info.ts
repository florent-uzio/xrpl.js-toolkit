import { convertCurrencyCodeToHex } from "../../helpers"
import { AMMInfoRequest } from "../../models"
import { getXrplClient } from "../../xrpl-client"

export const getAMMInfo = async ({ asset, asset2, ...rest }: AMMInfoRequest) => {
  if (asset.currency !== "XRP") {
    asset.currency = convertCurrencyCodeToHex(asset.currency)
  }

  if (asset2.currency !== "XRP") {
    asset2.currency = convertCurrencyCodeToHex(asset2.currency)
  }

  // Send the request
  const response = await getXrplClient().request({ asset, asset2, ...rest })
  console.log(JSON.stringify(response, undefined, 2))
}
