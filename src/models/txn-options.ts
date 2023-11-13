import { Client, Wallet } from "xrpl"

export type TxnOptions = { client: Client; wallet: Wallet; showLogs?: boolean } & (
  | { isMultisign?: true; signatures: string[] }
  | { isMultisign?: false; signatures?: never }
)
