import { writeFileSync } from "fs"
import { delay, Listr } from "listr2"
import path from "path"
import {
  AccountSet,
  AccountSetAsfFlags,
  Client,
  convertStringToHex,
  FundingOptions,
  Wallet,
} from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"
import { isUndefined } from "../helpers"
import { submitMethod } from "../methods"
import { submitTxnAndWait } from "../transactions"
import { IssueTokenContext } from "./issue-token.types"

type IssueTokenProps = {
  network: string
  numOperationalAccounts?: number
  numHolderAccounts?: number
  fundingOptions?: FundingOptions
  issuerSettings?: {
    setFlags?: AccountSetAsfFlags[]
  } & Pick<AccountSet, "Domain" | "TickSize" | "TransferRate" | "ClearFlag">
}

/**
 * Tasks to issue a token and create several wallets.
 */
export const issueTokenTasks = async (props: IssueTokenProps) => {
  const tasks = new Listr<IssueTokenContext>([], {
    concurrent: false,
    rendererOptions: {
      collapseSubtasks: false,
    },
  })

  tasks.add({
    title: "Initializing the context",
    task: async (ctx) => {
      ;(ctx.client = new Client(props.network)),
        (ctx.issuer = Wallet.generate()),
        (ctx.operationals = []),
        (ctx.holders = []),
        (ctx.issuerTickets = [])
    },
  })

  tasks.add({
    title: `Connect to the XRPL ${props.network}`,
    task: async (ctx) => {
      await ctx.client.connect()
    },
  })

  tasks.add({
    title: "Creating wallets",
    task: async (ctx, task) => {
      const subtasks = task.newListr<IssueTokenContext>([], {
        concurrent: true,
        rendererOptions: { collapseSubtasks: false },
        exitOnError: false,
      })
      createWallets({
        tasks: subtasks,
        ctx: ctx,
        ...props,
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating tickets for the issuer",
    enabled: canCreateTicketsForIssuer(props.issuerSettings),
    task: async (ctx, task) => {
      const numOfTicketsToCreate = calculateIssuerSettings(props.issuerSettings)

      if (numOfTicketsToCreate === 0) return

      await submitTxnAndWait({
        txn: {
          Account: ctx.issuer.address,
          TransactionType: "TicketCreate",
          TicketCount: numOfTicketsToCreate,
        },
        wallet: ctx.issuer,
        client: ctx.client,
        showLogs: false,
      })

      delay(1000)

      // Retrieve the ticket objects
      const tickets = await submitMethod({
        request: {
          command: "account_objects",
          type: "ticket",
          account: ctx.issuer.address,
        },
        client: ctx.client,
        showLogs: false,
      })

      ctx.issuerTickets = tickets.result.account_objects as Ticket[]

      task.output = `Created ${numOfTicketsToCreate} tickets for the issuer`
    },
  })

  tasks.add({
    title: "Configuring the issuer",
    task: async (ctx, task) => {
      const subtasks = task.newListr<IssueTokenContext>([], {
        concurrent: canCreateTicketsForIssuer(props.issuerSettings),
        rendererOptions: { collapseSubtasks: false },
      })
      //   task.output = ctx.issuerTickets
      configureIssuer({ ctx, tasks: subtasks, issuerSettings: props.issuerSettings })

      return subtasks
    },
  })

  tasks.add({
    title: "Disconnect the client",
    task: async (ctx) => {
      await ctx.client.disconnect()
    },
  })

  tasks.add({
    title: "Writing results to a file in the src/tasks/output directory",
    task: async (ctx) => {
      const time = new Date().toISOString()
      const pathFile = path.join(__dirname, "./output/", `results-${time}.json`)
      const result = {
        network: props.network,
        issuer: ctx.issuer,
        operationals: ctx.operationals,
        holders: ctx.holders,
      }
      writeFileSync(pathFile, JSON.stringify(result, null, 2))
    },
  })

  await tasks.run()
}

type CreateWalletsProps = {
  tasks: Listr<IssueTokenContext>
  ctx: IssueTokenContext
} & Omit<IssueTokenProps, "network">

/**
 * Create the tasks to create wallets
 */
const createWallets = ({
  tasks,
  numOperationalAccounts,
  numHolderAccounts,
  fundingOptions,
}: CreateWalletsProps) => {
  tasks.add({
    title: "Creating issuer",
    task: async (ctx) => {
      await ctx.client.fundWallet(ctx.issuer, fundingOptions)
    },
  })

  tasks.add({
    title: "Creating operational account(s)",
    enabled: () => !isUndefined(numOperationalAccounts) && numOperationalAccounts > 0,
    task: async (ctx) => {
      const operationalAccounts = Array.from({ length: numOperationalAccounts ?? 0 }, async () => {
        const operationalAccount = await ctx.client.fundWallet(null, fundingOptions)
        return operationalAccount.wallet
      })
      ctx.operationals = await Promise.all(operationalAccounts)
    },
    retry: 1,
  })

  tasks.add({
    title: "Creating holder account(s)",
    enabled: () => !isUndefined(numHolderAccounts) && numHolderAccounts > 0,
    task: async (ctx) => {
      const holderAccounts = Array.from({ length: numHolderAccounts ?? 0 }, async () => {
        // delay(random(3, 6))
        const account = await ctx.client.fundWallet(null, fundingOptions)
        return account.wallet
      })
      ctx.holders = await Promise.all(holderAccounts)
    },
    retry: 1,
  })

  return tasks
}

const random = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 1000)

type ConfigureIssuerProps = {
  ctx: IssueTokenContext
  tasks: Listr<IssueTokenContext>
} & Pick<IssueTokenProps, "issuerSettings">

export const configureIssuer = async ({ tasks, issuerSettings }: ConfigureIssuerProps) => {
  tasks.add({
    title: "Setting Domain",
    enabled: () =>
      !isUndefined(issuerSettings?.Domain) ||
      !isUndefined(issuerSettings?.TickSize) ||
      !isUndefined(issuerSettings?.TransferRate),
    task: async (ctx) => {
      const txn: AccountSet = {
        Account: ctx.issuer.address,
        TransactionType: "AccountSet",
        Domain: convertStringToHex(issuerSettings?.Domain ?? ""),
        TickSize: issuerSettings?.TickSize,
        TransferRate: issuerSettings?.TransferRate,
      }

      if (canCreateTicketsForIssuer(issuerSettings)) {
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
  })

  //   tasks.add({
  //     title: "Setting TickSize",
  //     enabled: () => !isUndefined(issuerSettings?.TickSize),
  //     task: async (ctx) => {
  //       delay(random(1, 4))
  //       const ticket = ctx.issuerTickets.shift()
  //       if (!ticket) throw new Error("No available tickets for setting TickSize")

  //       await submitTxnAndWait({
  //         txn: {
  //           Account: ctx.issuer.address,
  //           TransactionType: "AccountSet",
  //           TickSize: issuerSettings?.TickSize,
  //           TicketSequence: ticket.TicketSequence,
  //           Sequence: 0,
  //         },
  //         wallet: ctx.issuer,
  //         client: ctx.client,
  //         showLogs: false,
  //       })
  //     },
  //   })

  //   tasks.add({
  //     title: "Setting TransferRate",
  //     enabled: () => !isUndefined(issuerSettings?.TransferRate),
  //     task: async (ctx) => {
  //       delay(random(1, 4))
  //       const ticket = ctx.issuerTickets.shift()
  //       if (!ticket) throw new Error("No available tickets for setting TransferRate")

  //       await submitTxnAndWait({
  //         txn: {
  //           Account: ctx.issuer.address,
  //           TransactionType: "AccountSet",
  //           TransferRate: issuerSettings?.TransferRate,
  //           TicketSequence: ticket.TicketSequence,
  //           Sequence: 0,
  //         },
  //         wallet: ctx.issuer,
  //         client: ctx.client,
  //         showLogs: false,
  //       })
  //     },
  //   })

  tasks.add({
    title: "Setting AccountSet flags",
    enabled: () => !isUndefined(issuerSettings?.setFlags),
    task: async (_, task) => {
      if (!issuerSettings?.setFlags) return

      const subtasks = task.newListr<IssueTokenContext>([], { concurrent: false })

      for (const flag of issuerSettings.setFlags) {
        subtasks.add({
          title: `Setting flag number: ${flag}`,
          task: async (ctx) => {
            // delay(random(1, 4))
            // const ticket = ctx.issuerTickets.shift()
            // if (!ticket) {
            //   throw new Error(`No available tickets for setting AccountSet flags number: ${flag}`)
            // }

            await submitTxnAndWait({
              txn: {
                Account: ctx.issuer.address,
                TransactionType: "AccountSet",
                SetFlag: flag,
                // TicketSequence: ticket.TicketSequence,
                // Sequence: 0,
              },
              wallet: ctx.issuer,
              client: ctx.client,
              showLogs: false,
            })
          },
        })
      }

      return subtasks
    },

    //   await Promise.all(
    //     issuerSettings.setFlags.map(async (flag) => {
    //       delay(random(1, 4))

    //       const txn: AccountSet = {
    //         Account: ctx.issuer.address,
    //         TransactionType: "AccountSet",
    //         SetFlag: flag,
    //       }

    //       if (canCreateTicketsForIssuer(issuerSettings)) {
    //         const ticket = ctx.issuerTickets.shift()
    //         if (!ticket) {
    //           throw new Error(`No available tickets for setting AccountSet flags number: ${flag}`)
    //         }
    //         txn.TicketSequence = ticket.TicketSequence
    //         txn.Sequence = 0
    //       }

    //       await submitTxnAndWait({
    //         txn,
    //         wallet: ctx.issuer,
    //         client: ctx.client,
    //         showLogs: false,
    //       })
    //     }),
    //   )
    // },
    // retry: 1,
  })

  tasks.add({
    title: "Clearing AccountSet flags",
    enabled: () => !isUndefined(issuerSettings?.ClearFlag),
    task: async (ctx) => {
      const flags = Array.isArray(issuerSettings?.ClearFlag)
        ? issuerSettings?.ClearFlag
        : [issuerSettings?.ClearFlag]

      await Promise.all(
        flags.map(async (flag) => {
          delay(random(1, 4))
          const ticket = ctx.issuerTickets.shift()
          if (!ticket) {
            throw new Error(`No available tickets for clearing AccountSet flags number: ${flag}`)
          }

          await submitTxnAndWait({
            txn: {
              Account: ctx.issuer.address,
              TransactionType: "AccountSet",
              ClearFlag: flag,
              TicketSequence: ticket.TicketSequence,
              Sequence: 0,
            },
            wallet: ctx.issuer,
            client: ctx.client,
            showLogs: false,
          })
        }),
      )
    },
  })

  return tasks
}

const calculateIssuerSettings = (issuerSettings: IssueTokenProps["issuerSettings"]) => {
  let totalSettings = 0

  const { Domain, TickSize, TransferRate, setFlags, ClearFlag } = issuerSettings ?? {}

  if (Domain || TickSize || TransferRate) totalSettings++

  if (!isUndefined(issuerSettings?.setFlags)) {
    const setFlags =
      !isUndefined(issuerSettings?.setFlags) && Array.isArray(issuerSettings?.setFlags)
        ? issuerSettings?.setFlags
        : [issuerSettings?.setFlags]
    totalSettings = totalSettings + setFlags.length
  }

  if (!isUndefined(issuerSettings?.ClearFlag)) {
    const clearFlags = Array.isArray(issuerSettings?.ClearFlag)
      ? issuerSettings?.ClearFlag
      : [issuerSettings?.ClearFlag]
    totalSettings = totalSettings + clearFlags.length
  }

  return totalSettings
}

const canCreateTicketsForIssuer = (issuerSettings: IssueTokenProps["issuerSettings"]) => {
  return !issuerSettings?.setFlags?.includes(AccountSetAsfFlags.asfRequireAuth)
}
