import { Request } from "xrpl"
import { TxnOptions } from "./txn-options"

export type MethodProps<T extends Request> = Pick<TxnOptions, "showLogs" | "client"> & {
  methodRequest: Omit<T, "command">
}
