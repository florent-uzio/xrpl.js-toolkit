import color from "colors"
import * as xrpl from "xrpl"
import { prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type MintNftProps = Omit<xrpl.NFTokenMint, "TransactionType" | "Account">

export const mintNft = async ({ URI, Flags, ...rest }: MintNftProps, opts: TxnOptions) => {
  console.log(color.bold("******* LET'S MINT AN NFT *******"))
  console.log()

  // Construct the base transaction
  const transaction: xrpl.NFTokenMint = {
    TransactionType: "NFTokenMint",
    Account: opts.wallet.address,
    Flags: Flags ?? xrpl.NFTokenMintFlags.tfTransferable,
    URI: URI ? xrpl.convertStringToHex(URI) : "",
    ...rest,
  }

  // Autofill transaction with additional fields, sign and submit
  await prepareSignSubmit(transaction, opts)
}
