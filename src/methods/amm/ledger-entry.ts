import { LedgerEntryRequest } from "xrpl"
import { MethodProps } from "../../models"

export const getLedgerEntry = async ({
  client,
  methodRequest,
  showLogs = true,
}: MethodProps<LedgerEntryRequest>) => {
  // Send the request
  const response = await client.request({
    command: "ledger_entry",
    ...methodRequest,
  })

  if (showLogs) {
    console.log(JSON.stringify(response, undefined, 2))
  }

  return response
}
