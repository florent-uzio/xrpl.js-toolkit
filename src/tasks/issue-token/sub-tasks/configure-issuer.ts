import { delay, ListrTask } from "listr2"
import { AccountSet, convertStringToHex } from "xrpl"
import { isUndefined } from "../../../helpers"
import { submitTxnAndWait } from "../../../transactions"
import { canIssuerCreateTickets, getAccountSetAsfName, random } from "../../helpers"
import { IssueTokenContext, IssueTokenProps } from "../issue-token.types"

export const createIssuerConfigurationTasks = (
  issuerSettings: IssueTokenProps["issuerSettings"],
): ListrTask<IssueTokenContext>[] => {
  if (!issuerSettings) {
    return []
  }

  const settings = Object.keys(issuerSettings)
  const settingsToDisplay = settings.filter(
    (setting) => setting !== "setFlags" && setting !== "ClearFlag",
  )

  return [
    {
      title: `Setting ${settingsToDisplay.join(", ")} in AccountSet`,
      enabled: () => hasNonFlagIssuerSettings(issuerSettings),
      task: async (ctx) => {
        const txn: AccountSet = {
          Account: ctx.issuer.address,
          TransactionType: "AccountSet",
          Domain: convertStringToHex(issuerSettings?.Domain ?? ""),
          TickSize: issuerSettings?.TickSize,
          TransferRate: issuerSettings?.TransferRate,
        }

        if (canIssuerCreateTickets(issuerSettings)) {
          const ticket = ctx.issuerTickets.shift()
          if (!ticket) {
            throw new Error("No available tickets for setting Domain")
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
      retry: 1,
    },

    {
      title: "Setting AccountSet flags",
      enabled: () => !isUndefined(issuerSettings?.setFlags),
      task: async (_, task) => {
        if (!issuerSettings?.setFlags) return

        const subtasks = task.newListr<IssueTokenContext>([], { concurrent: false })

        for (const flag of issuerSettings.setFlags) {
          subtasks.add({
            title: `Setting flag: ${getAccountSetAsfName(flag)}`,
            task: async (ctx) => {
              delay(random(1, 4))

              const txn: AccountSet = {
                Account: ctx.issuer.address,
                TransactionType: "AccountSet",
                SetFlag: flag,
              }

              if (canIssuerCreateTickets(issuerSettings)) {
                const ticket = ctx.issuerTickets.shift()
                if (!ticket) {
                  throw new Error(
                    `No available tickets for setting AccountSet flags number: ${flag}`,
                  )
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
      },
    },

    {
      title: "Clearing AccountSet flags",
      enabled: () => !isUndefined(issuerSettings?.ClearFlag),
      task: async (ctx) => {
        const flags = Array.isArray(issuerSettings?.ClearFlag)
          ? issuerSettings?.ClearFlag
          : [issuerSettings?.ClearFlag]

        await Promise.all(
          flags.map(async (flag) => {
            delay(random(1, 4))

            const txn: AccountSet = {
              Account: ctx.issuer.address,
              TransactionType: "AccountSet",
              ClearFlag: flag,
            }

            if (canIssuerCreateTickets(issuerSettings)) {
              const ticket = ctx.issuerTickets.shift()
              if (!ticket) {
                throw new Error(
                  `No available tickets for clearing AccountSet flags number: ${flag}`,
                )
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
          }),
        )
      },
    },
  ]
}

/**
 * Check if there are any non-flag issuer settings
 * @param issuerSettings
 * @returns A boolean indicating if there are any non-flag issuer settings
 */
const hasNonFlagIssuerSettings = (issuerSettings: IssueTokenProps["issuerSettings"]) => {
  const { Domain, TickSize, TransferRate } = issuerSettings ?? {}

  return !isUndefined(Domain) || !isUndefined(TickSize) || !isUndefined(TransferRate)
}
