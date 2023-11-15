import { NFTokenAcceptOffer } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type AcceptNftOfferProps =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<NFTokenAcceptOffer>

export const acceptNftOffer = async (props: AcceptNftOfferProps) => {
  console.log("******* LET'S ACCEPT AN NFT OFFER *******")
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { txn, wallet } = props

    // Construct the base transaction
    const transaction: NFTokenAcceptOffer = {
      Account: wallet.address,
      TransactionType: "NFTokenAcceptOffer",
      ...txn,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
