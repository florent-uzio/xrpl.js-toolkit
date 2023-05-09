import color from "colors"
import * as xrpl from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { xrplClient } from "../xrpl-client"

type mintNftProps = {
  nftUri: string
  wallet: xrpl.Wallet
}

export const mintNft = async ({ nftUri, wallet }: mintNftProps) => {
  console.log(color.bold("******* LET'S MINT AN NFT *******"))
  console.log()

  // Connect to the XRP Ledger
  await xrplClient.connect()

  // Construct the base transaction
  const transaction: xrpl.NFTokenMint = {
    TransactionType: "NFTokenMint",
    Account: wallet.address,
    // An arbitrary taxon, or shared identifier, for a series or collection of related NFTs. To mint a series of NFTs, give them all the same taxon.
    NFTokenTaxon: 0,
    Flags: xrpl.NFTokenMintFlags.tfTransferable,
    URI: xrpl.convertStringToHex(nftUri),
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, wallet)

  await xrplClient.disconnect()
}
