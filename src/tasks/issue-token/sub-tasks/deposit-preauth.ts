import { ListrTask } from "listr2"
import { DepositPreauth, Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { hasEnoughOperational } from "../../helpers"
import { TokenIssuanceContext } from "../issue-token.types"

export const depositPreAuthTasks = (accounts: Wallet[]): ListrTask<TokenIssuanceContext>[] => {
  const subtasks: ListrTask<TokenIssuanceContext>[] = []

  for (const account of accounts) {
    subtasks.push({
      title: `Pre-authorizing ${account.address}`,
      task: async (ctx) => {
        const txn: DepositPreauth = {
          Account: ctx.issuer.address,
          TransactionType: "DepositPreauth",
          Authorize: account.address,
        }

        if (hasEnoughOperational(ctx)) {
          const ticket = ctx.issuerTickets.shift()
          if (!ticket) {
            throw new Error(`No available tickets to pre authorize: ${account.address}`)
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
