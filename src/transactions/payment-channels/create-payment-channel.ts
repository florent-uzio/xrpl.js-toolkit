import { PaymentChannelCreate, xrpToDrops } from "xrpl"
import { multiSignAndSubmit, prepareSignSubmit } from "../../helpers"
import { TransactionPropsForMultiSign, TransactionPropsForSingleSign } from "../../models"

type CreatePaymentChannelProps =
  | TransactionPropsForMultiSign
  | TransactionPropsForSingleSign<PaymentChannelCreate>

export const createPaymentChannel = async (props: CreatePaymentChannelProps) => {
  console.log("LET'S CREATE A PAYMENT CHANNEL")

  if (props.isMultisign) {
    multiSignAndSubmit(props.signatures)
  } else {
    const { txn, showLogs, wallet, signatures } = props
    let { Amount, ...rest } = txn

    Amount = xrpToDrops(Amount)

    // Construct the base transaction
    const transaction: PaymentChannelCreate = {
      Account: wallet.address,
      Amount,
      TransactionType: "PaymentChannelCreate",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, { signatures, wallet, showLogs })
  }
}
