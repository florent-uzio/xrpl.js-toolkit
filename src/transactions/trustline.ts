import color from "colors"
import { TrustSet } from "xrpl"
import { convertCurrencyCodeToHex, multiSignAndSubmit, prepareSignSubmit } from "../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../models"

type CreateTrustlineProps = TransactionPropsForMultiSign | TransactionPropsForSingleSign<TrustSet>

export const createTrustline = async (props: CreateTrustlineProps) => {
  console.log(color.bold("******* LET'S CREATE A TRUSTLINE *******"))
  console.log()

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures)
  } else {
    const { LimitAmount, ...rest } = props.txn
    const { wallet, showLogs, signatures } = props

    // Construct the base transaction
    const transaction: TrustSet = {
      Account: props.wallet.address,
      TransactionType: "TrustSet",
      LimitAmount: {
        ...LimitAmount,
        currency: convertCurrencyCodeToHex(LimitAmount.currency),
      },
      ...rest,
    }

    // Autofill transaction with additional fields (such as LastLedgerSequence), sign and submit
    await prepareSignSubmit(transaction, { signatures, wallet, showLogs })
  }
}
