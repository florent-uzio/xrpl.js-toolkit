import color from "colors"
import { NFTokenMint, NFTokenMintFlags, convertStringToHex } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type MintNFTProps = TransactionPropsForMultiSign | TransactionPropsForSingleSign<NFTokenMint>

export const mintNft = async (props: MintNFTProps) => {
  console.log(color.bold("******* LET'S MINT AN NFT *******"))
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { txn, wallet } = props
    const { Flags, URI, ...rest } = txn

    // Construct the base transaction
    const transaction: NFTokenMint = {
      TransactionType: "NFTokenMint",
      Account: wallet.address,
      Flags: Flags ?? NFTokenMintFlags.tfTransferable,
      URI: URI ? convertStringToHex(URI) : "",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
