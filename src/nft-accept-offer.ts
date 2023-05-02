import color from "colors"
import * as xrpl from "xrpl"
import { xrplClient } from "./xrpl-client"

type NftAcceptOfferProps = {
  wallet: xrpl.Wallet
} & ({ buyOfferId: string; sellOfferId?: never } | { buyOfferId?: never; sellOfferId: string })

export const nftAcceptOffer = async ({ buyOfferId, sellOfferId, wallet }: NftAcceptOfferProps) => {
  console.log(color.bold("******* LET'S ACCEPT AN NFT OFFER *******"))
  console.log("")

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const nfTokenAcceptOfferTxn: xrpl.NFTokenAcceptOffer = {
    Account: wallet.address,
    TransactionType: "NFTokenAcceptOffer",
  }

  if (sellOfferId) {
    nfTokenAcceptOfferTxn.NFTokenSellOffer = sellOfferId
  }
  if (buyOfferId) {
    nfTokenAcceptOfferTxn.NFTokenBuyOffer = buyOfferId
  }

  // Autofill transaction with additional fields.
  const preparedTxn = await xrplClient.autofill(nfTokenAcceptOfferTxn)

  console.log(color.bold("******* Prepared Transaction *******"))
  console.log(preparedTxn)
  console.log(color.bold("************************************"))

  // Sign the transaction
  const signedTxn = wallet.sign(preparedTxn)

  console.log("")
  console.log(color.bold("******* Signed Transaction *******"))
  console.log(signedTxn)
  console.log(color.bold("************************************"))
  console.log("")

  // Start calculating the time to execute this transaction
  const start = performance.now()

  // Submit the transaction to the XRP Ledger and wait for it to be validated
  const response = await xrplClient.submitAndWait(signedTxn.tx_blob)

  console.log(color.bold("******* FINAL: Validated Transaction *******"))
  console.log(response)
  console.log(color.bold("********************************************"))
  console.log("")

  // Check the end time to execute this transaction
  const end = performance.now()

  console.log(`Execution time: ${end - start} ms`)
  console.log("")
  console.log(color.green(`https://test.bithomp.com/nfts/${response.result.Account}`))

  await xrplClient.disconnect()
}
