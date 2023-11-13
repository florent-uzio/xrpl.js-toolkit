import { AccountNFTsRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getAccountNfts = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<AccountNFTsRequest>) => {
  const response = await client.request({ command: "account_nfts", ...methodRequest })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
