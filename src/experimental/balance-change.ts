import { getBalanceChanges } from "xrpl"
import { isString } from "../helpers"
import { getAccountTx } from "../methods"

export const showBalanceChanges = async (address: string) => {
  const txns = await getAccountTx({ account: address, command: "account_tx" })

  txns.result.transactions.map((txn) => {
    if (!isString(txn.meta)) {
      const res = getBalanceChanges(txn.meta)
      console.log(JSON.stringify(res, null, 2))
    }
  })
}
