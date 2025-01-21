import { ListrTask } from "listr2"
import { Payment, Wallet } from "xrpl"
import { submitTxnAndWait } from "../../../transactions"
import { canIssuerCreateTicketsToIssueToken } from "../../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

export const paymentTasks = (
  currency: TokenIssuanceConfig["trustLineParams"]["currency"],
  value: TokenIssuanceConfig["trustLineParams"]["value"],
  accounts: Wallet[],
): ListrTask<TokenIssuanceContext>[] => {
  const subtasks: ListrTask<TokenIssuanceContext>[] = []

  for (const account of accounts) {
    subtasks.push({
      title: `Sending the token to ${account.address}`,
      task: async (ctx) => {
        const txn: Payment = {
          Account: ctx.issuer.address,
          TransactionType: "Payment",
          Amount: {
            currency,
            value: (+value / 2).toString(),
            issuer: account.address,
          },
          Destination: account.address,
        }

        if (canIssuerCreateTicketsToIssueToken(ctx)) {
          const ticket = ctx.issuerTickets.shift()
          if (!ticket) {
            throw new Error(`No available tickets to send a token to: ${account.address}`)
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
