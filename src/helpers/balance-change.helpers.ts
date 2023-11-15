import { AccountTxResponse, Client, TxResponse, getBalanceChanges } from "xrpl"
import { isString } from "."
import { getAccountTx, getTx } from "../methods"

/**
 * https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction
 *
 * @param address The xrpl account address
 */
export const showAccountBalanceChanges = async (address: string, client: Client) => {
  const txns = (await getAccountTx({
    methodRequest: { account: address, command: "account_tx" },
    client,
  })) as AccountTxResponse

  txns.result.transactions.map((txn) => {
    if (!isString(txn.meta)) {
      const res = getBalanceChanges(txn.meta)
      console.log(JSON.stringify(res, null, 2))
    }
  })
}

export const showTxBalanceChanges = async (transaction: string, client: Client) => {
  const txn = (await getTx({
    methodRequest: { transaction, command: "tx" },
    client,
  })) as TxResponse

  if (!txn.result.meta) return

  if (!isString(txn.result.meta)) {
    const res = getBalanceChanges(txn.result.meta)
    console.log(JSON.stringify(res, null, 2))
  }
}
