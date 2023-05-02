import color from "colors"
import * as xrpl from "xrpl"
import { Amount } from "xrpl/dist/npm/models/common"
import { xrplClient } from "./xrpl-client"

type NftCreateOfferProps = {
  amount: Amount
  tokenId: string
  wallet: xrpl.Wallet
} & ({ isSell: false; owner: string } | { isSell: true; owner?: never })

export const nftCreateOffer = async ({
  amount,
  isSell,
  owner,
  tokenId,
  wallet,
}: NftCreateOfferProps) => {
  console.log(color.bold("******* LET'S CREATE AN NFT OFFER *******"))
  console.log("")

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Convert the amount to drops (1 drop = .000001 XRP)
  if (typeof amount === "string") {
    amount = xrpl.xrpToDrops(amount)
  }

  // Construct the base transaction
  const nfTokenCreateOfferTxn: xrpl.NFTokenCreateOffer = {
    Account: wallet.address,
    Amount: amount,
    Flags: isSell ? xrpl.NFTokenCreateOfferFlags.tfSellNFToken : undefined,
    NFTokenID: tokenId,
    TransactionType: "NFTokenCreateOffer",
  }

  if (owner) {
    nfTokenCreateOfferTxn.Owner = owner
  }

  // Autofill transaction with additional fields.
  const preparedTxn = await xrplClient.autofill(nfTokenCreateOfferTxn)

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
