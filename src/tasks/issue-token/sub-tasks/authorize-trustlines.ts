import { ListrTask } from "listr2"
import { TrustSet, TrustSetFlags, Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { hasEnoughHolders } from "../../helpers"
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
        const txn: TrustSet = {
          Account: ctx.issuer.address,
          TransactionType: "TrustSet",
          LimitAmount: {
            currency,
            value: "0",
            issuer: account.address,
          },
          Flags: TrustSetFlags.tfSetfAuth,
        }

        if (hasEnoughHolders(ctx)) {
          const ticket = ctx.issuerTickets.shift()
          if (!ticket) {
            throw new Error(`No available tickets to authorize trustline for: ${account.address}`)
          }
          txn.TicketSequence = ticket.TicketSequence
          txn.Sequence = 0
        }

        await submitTxnAndWait({
          txn,
          wallet: ctx.issuer,
          client: ctx.client,
          showLogs: false,
        })
      },
    })
  }

  return subtasks
}
