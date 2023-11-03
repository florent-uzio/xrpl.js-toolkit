import { XChainCreateClaimID } from "xrpl"
import { multiSignAndSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"
import { getXrplClient } from "../../xrpl-client"

type XChainCreateClaimIdProps =
  | TransactionPropsForSingleSign<XChainCreateClaimID>
  | TransactionPropsForMultiSign

const client = getXrplClient()

export const xChainCreateClaimId = (props: XChainCreateClaimIdProps) => {
  console.log("LET'S CREATE A XCHAIN CLAIM ID")
  console.log()

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures)
  } else {
    const { wallet, txn, showLogs = true } = props

    const transaction: XChainCreateClaimID = {
      Account: wallet.address,
      TransactionType: "XChainCreateClaimID",
      ...txn,
    }

    const result = client.submitAndWait(transaction, { autofill: true, wallet })

    if (showLogs) {
      console.log(result)
    }

    return result
  }
}
