import { PaymentChannelClaim, xrpToDrops } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type CreatePaymentChannelProps =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<PaymentChannelClaim>

export const claimPaymentChannel = async (props: CreatePaymentChannelProps) => {
  console.log("LET'S CLAIM A PAYMENT CHANNEL")

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures, props.client)
  } else {
    const { client, txn, showLogs, wallet, signatures } = props
    let { Amount, ...rest } = txn

    Amount = Amount && xrpToDrops(Amount)

    // Construct the base transaction
    const transaction: PaymentChannelClaim = {
      Account: wallet.address,
      Amount,
      TransactionType: "PaymentChannelClaim",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, { client, signatures, wallet, showLogs })
  }
}
