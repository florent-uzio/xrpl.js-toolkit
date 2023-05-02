import color from "colors"
import * as xrpl from "xrpl"
import { xrplClient } from "./xrpl-client"

type NftMintProps = {
  nftUri: string
  wallet: xrpl.Wallet
}

export const nftMint = async ({ nftUri, wallet }: NftMintProps) => {
  console.log(color.bold("******* LET'S MINT AN NFT *******"))
  console.log("")

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base payment transaction
  const nfTokenMintTxn: xrpl.NFTokenMint = {
    TransactionType: "NFTokenMint",
    Account: wallet.address,
    // An arbitrary taxon, or shared identifier, for a series or collection of related NFTs. To mint a series of NFTs, give them all the same taxon.
    NFTokenTaxon: 0,
    Flags: xrpl.NFTokenMintFlags.tfTransferable,
    URI: xrpl.convertStringToHex(nftUri),
  }

  // Autofill transaction with additional fields.
  const preparedTxn = await xrplClient.autofill(nfTokenMintTxn)

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
  const nftMintReponse = await xrplClient.submitAndWait(signedTxn.tx_blob)

  console.log(color.bold("******* FINAL: Validated Transaction *******"))
  console.log(nftMintReponse)
  console.log(color.bold("********************************************"))
  console.log("")

  // Check the end time to execute this transaction
  const end = performance.now()

  console.log(`Execution time: ${end - start} ms`)
  console.log("")
  console.log(color.green(`https://test.bithomp.com/nfts/${nftMintReponse.result.Account}`))

  await xrplClient.disconnect()
}
