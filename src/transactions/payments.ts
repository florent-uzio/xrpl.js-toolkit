import color from "colors"
import { Payment, xrpToDrops } from "xrpl"
import { convertCurrencyCodeToHex, multiSignAndSubmit, prepareSignSubmit } from "../helpers"
import { TxnOptions } from "../models"

type SendPaymentPropsForMultiSign = TxnOptions & {
  isMultisign: true
}

type SendPaymentPropsForSingleSign = TxnOptions & {
  isMultisign?: false
  txn: Omit<Payment, "TransactionType" | "Account">
}

type SendPaymentProps = SendPaymentPropsForMultiSign | SendPaymentPropsForSingleSign

/**
 * Send a payment
 */
export const sendPayment = async (props: SendPaymentProps) => {
  console.log(color.bold("******* LET'S SEND A PAYMENT *******"))
  console.log()

  if (props.isMultisign) {
    // Handle the multi-sign scenario
    await multiSignAndSubmit(props.signatures)
  } else {
    let { Amount, ...rest } = props.txn
    const { wallet, showLogs, signatures } = props

    // Convert the amount to drops (1 drop = .000001 XRP)
    if (typeof Amount === "string") {
      Amount = xrpToDrops(Amount)
    } else {
      Amount.currency = convertCurrencyCodeToHex(Amount.currency)
    }

    // Construct the base transaction
    const transaction: Payment = {
      Account: wallet.address,
      Amount,
      TransactionType: "Payment",
      ...rest,
    }

    // Autofill transaction with additional fields, sign and submit
    await prepareSignSubmit(transaction, { signatures, wallet, showLogs })
  }
}
