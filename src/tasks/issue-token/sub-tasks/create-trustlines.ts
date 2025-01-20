import { ListrTask } from "listr2"
import { Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { IssueTokenContext, IssueTokenProps } from "../issue-token.types"

export const createTrustlinesTasks = (
  props: IssueTokenProps["trustSetParams"],
  accounts: Wallet[],
): ListrTask<IssueTokenContext>[] => {
  const subtasks: ListrTask<IssueTokenContext>[] = []

  for (const account of accounts) {
    subtasks.push({
      title: `Creating trustline for ${account.address}`,
      task: async (ctx) => {
        await submitTxnAndWait({
          txn: {
            Account: account.address,
            TransactionType: "TrustSet",
            ...props,
            LimitAmount: {
              currency: props.currency,
              value: props.value,
              issuer: ctx.issuer.address,
            },
          },
          wallet: account,
          client: ctx.client,
          showLogs: false,
        })
      },
    })
  }

  return subtasks
}
