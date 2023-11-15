import { NFTokenCreateOffer, xrpToDrops } from "xrpl"
import { isString, multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type CreateNftOfferProps =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<NFTokenCreateOffer>

// type CreateNftOfferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account"> &
//   (
//     | { Flags: NFTokenCreateOfferFlags.tfSellNFToken; Owner?: never }
//     | { Flags?: undefined; Owner: string }
//   )

export const createNftOffer = async (props: CreateNftOfferProps) => {
  console.log("******* LET'S CREATE AN NFT OFFER *******")
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { txn, wallet } = props
    let { Amount, ...rest } = txn

    // Convert the amount to drops (1 drop = .000001 XRP)
    if (isString(Amount)) {
      Amount = xrpToDrops(Amount)
    }

    // Construct the base transaction
    const transaction: NFTokenCreateOffer = {
      Account: wallet.address,
      Amount,
      TransactionType: "NFTokenCreateOffer",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, props)
  }
}
