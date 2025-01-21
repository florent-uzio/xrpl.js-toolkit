import { ListrTask } from "listr2"
import { TrustSetFlags, Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

export const authorizeTrustlinesTasks = (
  currency: TokenIssuanceConfig["trustLineParams"]["currency"],
  accounts: Wallet[],
): ListrTask<TokenIssuanceContext>[] => {
  const subtasks: ListrTask<TokenIssuanceContext>[] = []

  for (const account of accounts) {
    subtasks.push({
      title: `Authorizing trustline for ${account.address}`,
      task: async (ctx) => {
        await submitTxnAndWait({
          txn: {
            Account: ctx.issuer.address,
            TransactionType: "TrustSet",
            LimitAmount: {
              currency,
              value: "0",
              issuer: account.address,
            },
            Flags: TrustSetFlags.tfSetfAuth,
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
