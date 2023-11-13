import { AccountOffersRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getAccountOffers = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountOffersRequest>) => {
  const response = await client.request({
    command: "account_offers",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
