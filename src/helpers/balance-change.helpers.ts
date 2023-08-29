import { getBalanceChanges } from "xrpl"
import { isString } from "."
import { getAccountTx } from "../methods"

/**
 * https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction
 *
 * @param address The xrpl account address
 */
export const showBalanceChanges = async (address: string) => {
  const txns = await getAccountTx({ account: address, command: "account_tx" })

  txns.result.transactions.map((txn) => {
    if (!isString(txn.meta)) {
      const res = getBalanceChanges(txn.meta)
      console.log(JSON.stringify(res, null, 2))
    }
  })
}
