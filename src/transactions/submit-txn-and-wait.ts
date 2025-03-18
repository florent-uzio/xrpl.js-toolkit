import { SubmittableTransaction, TxResponse } from "xrpl"
import { convertCurrencyCodeToHex, deepReplace, multiSignAndSubmit } from "../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../models"

type SubmitTxnAndWaitProps<T extends SubmittableTransaction> =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<T>

export async function submitTxnAndWait<T extends SubmittableTransaction>(
  props: SubmitTxnAndWaitProps<T> & { run: false },
): Promise<undefined>
export async function submitTxnAndWait<T extends SubmittableTransaction>(
  props: SubmitTxnAndWaitProps<T> & { run?: true },
): Promise<TxResponse<T>>
export async function submitTxnAndWait<T extends SubmittableTransaction>({
  run = true,
  ...props
}: SubmitTxnAndWaitProps<T>) {
  if (!run) {
    if (!props.showLogs) {
      console.log("Transaction submission skipped as 'run' is set to false")
    }
    return
  }

  if (props.isMultisign) {
    await multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { wallet, client, txn, showLogs = true, showHash = true } = props

    if (showLogs) {
      console.log(`Submitting: ${txn.TransactionType}`)
      console.log()
    }

    // Make sure the originating transaction address is the same as the wallet public address
    if (props.txn.Account !== wallet.address) {
      throw new Error("Field 'Account' must have the same address as the Wallet")
    }

    // Update the currency in case it has more than 3 characters
    const updatedTxn = deepReplace(txn, "currency", (key, value) => {
      return { [key]: convertCurrencyCodeToHex(value) }
    })

    // Submit to the XRPL and wait for the response
    const response = await client.submitAndWait(updatedTxn, { autofill: true, wallet })

    if (showLogs) {
      console.log(JSON.stringify(response, null, 2))
    }

    if (showHash) {
      console.log(
        // @ts-expect-error
        `🌎 Trnsaction Result: ${response.result.meta?.TransactionResult},  Transaction hash: ${response.result.hash}`,
      )
    }

    return response
  }
}
