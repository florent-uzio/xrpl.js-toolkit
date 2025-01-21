import { ListrTask } from "listr2"
import { Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

export const createTrustlinesTasks = (
  props: TokenIssuanceConfig["trustLineParams"],
  accounts: Wallet[],
): ListrTask<TokenIssuanceContext>[] => {
  const subtasks: ListrTask<TokenIssuanceContext>[] = []

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
