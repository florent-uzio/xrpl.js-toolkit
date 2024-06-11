import { SubmittableTransaction } from "xrpl"
import { convertCurrencyCodeToHex, deepReplace, multiSignAndSubmit } from "../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../models"

type SubmitTxnAndWaitProps<T extends SubmittableTransaction> =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<T>

export const submitTxnAndWait = async <T extends SubmittableTransaction>(
  props: SubmitTxnAndWaitProps<T>,
) => {
  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { wallet, client, txn, showLogs = true } = props

    console.log(`LET'S SEND: ${txn.TransactionType}`)
    console.log()

    // Make sure the originating transaction address is the same as the wallet public address
    if (props.txn.Account !== wallet.address) {
      throw new Error("Field 'Account' must have the same address as the Wallet")
    }

    // Update the currency in case it has more than 3 characters
    const updatedTxn = deepReplace(txn, "currency", (key, value) => {
      return { key: convertCurrencyCodeToHex(value) }
    })

    // Submit to the XRPL and wait for the response
    const response = await client.submitAndWait(updatedTxn, { autofill: true, wallet })

    if (showLogs) {
      console.log(JSON.stringify(response, null, 2))
    }

    return response
  }
}
