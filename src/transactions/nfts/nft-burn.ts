import { NFTokenBurn } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type AcceptNftOfferProps = TransactionPropsForMultiSign | TransactionPropsForSingleSign<NFTokenBurn>

export const burnNft = async (props: AcceptNftOfferProps) => {
  console.log("******* LET'S BURN AN NFT *******")
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { txn, wallet } = props

    // Construct the base transaction
    const transaction: NFTokenBurn = {
      Account: wallet.address,
      TransactionType: "NFTokenBurn",
      ...txn,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
