import { xrplClient } from "./xrpl-client"

export const nftMint = async () => {
  await xrplClient.connect()

  const ledgerIndex = await xrplClient.getLedgerIndex()
  console.log(ledgerIndex)
  await xrplClient.disconnect()
}
