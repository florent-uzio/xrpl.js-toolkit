import { XChainCommit } from "xrpl"
import { multiSignAndSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type XChainCommitProps = TransactionPropsForSingleSign<XChainCommit> | TransactionPropsForMultiSign

export const xChainCommit = async (props: XChainCommitProps) => {
  console.log("******* LET'S CREATE A XCHAIN COMMIT *******")
  console.log()

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { client, wallet, txn, showLogs = true } = props

    const transaction: XChainCommit = {
      Account: wallet.address,
      TransactionType: "XChainCommit",
      ...txn,
    }

    const result = await client.submitAndWait(transaction, { autofill: true, wallet })

    if (showLogs) {
      console.log(JSON.stringify(result, null, 2))
    }

    return result
  }
}
