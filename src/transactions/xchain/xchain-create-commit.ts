import { XChainAccountCreateCommit } from "xrpl"
import { multiSignAndSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"
import { getXrplClient } from "../../xrpl-client"

type XChainAccountCreateCommitProps =
  | TransactionPropsForSingleSign<XChainAccountCreateCommit>
  | TransactionPropsForMultiSign

const client = getXrplClient()

export const xChainAccountCreateCommit = (props: XChainAccountCreateCommitProps) => {
  console.log("LET'S CREATE A XCHAIN ACCOUNT COMMIT")
  console.log()

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures)
  } else {
    const { wallet, txn, showLogs = true } = props

    const transaction: XChainAccountCreateCommit = {
      Account: wallet.address,
      TransactionType: "XChainAccountCreateCommit",
      ...txn,
    }

    const result = client.submitAndWait(transaction, { autofill: true, wallet })

    if (showLogs) {
      console.log(result)
    }

    return result
  }
}
