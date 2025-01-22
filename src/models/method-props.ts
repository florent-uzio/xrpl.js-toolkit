import { Request } from "xrpl"
import { TxnCommons } from "./transaction-props"

export type MethodProps<T extends Request> = Pick<TxnCommons, "showLogs" | "client" | "run"> & {
  request: T
}
