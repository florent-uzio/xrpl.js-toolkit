import { Wallet } from "xrpl"

export type TxnOptions = { wallet: Wallet; showLogs?: boolean } & (
  | { isMultisign?: true; signatures: string[] }
  | { isMultisign?: false; signatures?: never }
)
