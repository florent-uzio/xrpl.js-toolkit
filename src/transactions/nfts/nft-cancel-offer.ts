import color from "colors"
import { NFTokenCancelOffer } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type CancelNftOfferProps =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<NFTokenCancelOffer>

export const cancelNftOffer = async (props: CancelNftOfferProps) => {
  console.log(color.bold("******* LET'S CANCEL AN NFT OFFER *******"))
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { txn, wallet } = props

    // Construct the base transaction
    const transaction: NFTokenCancelOffer = {
      Account: wallet.address,
      TransactionType: "NFTokenCancelOffer",
      ...txn,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
