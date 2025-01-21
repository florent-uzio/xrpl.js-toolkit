import { ListrTask } from "listr2"
import { Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

export const paymentTasks = (
  currency: TokenIssuanceConfig["trustLineParams"]["currency"],
  accounts: Wallet[],
): ListrTask<TokenIssuanceContext>[] => {
  const subtasks: ListrTask<TokenIssuanceContext>[] = []

  for (const account of accounts) {
    subtasks.push({
      title: `Sending the token to ${account.address}`,
      task: async (ctx) => {
        await submitTxnAndWait({
          txn: {
            Account: ctx.issuer.address,
            TransactionType: "Payment",
            Amount: {
              currency,
              value: "1000000",
              issuer: account.address,
            },
            Destination: account.address,
          },
          wallet: ctx.issuer,
          client: ctx.client,
          showLogs: false,
        })
      },
    })
  }

  return subtasks
}
