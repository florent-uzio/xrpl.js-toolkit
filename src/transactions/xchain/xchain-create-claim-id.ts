import { XChainCreateClaimID } from "xrpl"
import { multiSignAndSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type XChainCreateClaimIdProps =
  | TransactionPropsForSingleSign<XChainCreateClaimID>
  | TransactionPropsForMultiSign

export const xChainCreateClaimId = async (props: XChainCreateClaimIdProps) => {
  console.log("******* LET'S CREATE A XCHAIN CLAIM ID *******")
  console.log()

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures)
  } else {
    const { client, wallet, txn, showLogs = true } = props

    const transaction: XChainCreateClaimID = {
      Account: wallet.address,
      TransactionType: "XChainCreateClaimID",
      ...txn,
    }

    const result = await client.submitAndWait(transaction, { autofill: true, wallet })

    if (showLogs) {
      console.log(JSON.stringify(result, null, 2))
    }

    return result
  }
}
