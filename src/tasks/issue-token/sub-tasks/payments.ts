import { ListrTask } from "listr2"
import { Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { IssueTokenContext, IssueTokenProps } from "../issue-token.types"

export const paymentTasks = (
  currency: IssueTokenProps["trustSetParams"]["currency"],
  accounts: Wallet[],
): ListrTask<IssueTokenContext>[] => {
  const subtasks: ListrTask<IssueTokenContext>[] = []

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
