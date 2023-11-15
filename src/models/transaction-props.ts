import { NFTokenCreateOffer, NFTokenCreateOfferFlags, Transaction } from "xrpl"
import { TxnOptions } from "./txn-options"

export type TransactionPropsForMultiSign = TxnOptions & {
  isMultisign: true
}

export type TransactionPropsForSingleSign<T extends Transaction> = TxnOptions & {
  isMultisign?: false
  txn: T extends NFTokenCreateOffer
    ? Omit<T, "TransactionType" | "Account"> &
        (
          | { Flags: NFTokenCreateOfferFlags.tfSellNFToken; Owner?: never }
          | { Flags?: undefined; Owner: string }
        )
    : Omit<T, "TransactionType" | "Account">
}
