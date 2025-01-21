import { writeFileSync } from "fs"
import { delay, Listr } from "listr2"
import path from "path"
import { Client, Wallet } from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"
import { submitMethod } from "../../methods"
import { submitTxnAndWait } from "../../transactions"
import { canIssuerCreateTickets, countIssuerSettings, hasIssuerRequireAuth } from "../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "./issue-token.types"
import {
  createIssuerConfigurationTasks,
  createTrustlinesTasks,
  createWalletsTasks,
  paymentTasks,
} from "./sub-tasks"
import { authorizeTrustlinesTasks } from "./sub-tasks/authorize-trustlines"

/**
 * Tasks to issue a token and create several wallets.
 */
export const issueTokenTasks = async (props: TokenIssuanceConfig) => {
  const tasks = new Listr<TokenIssuanceContext>([], {
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
        (ctx.operationalAccounts = []),
        (ctx.holderAccounts = []),
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
      const walletsTasks = createWalletsTasks(props)
      const subtasks = task.newListr<TokenIssuanceContext>(walletsTasks, {
        concurrent: true,
        rendererOptions: { collapseSubtasks: false },
        exitOnError: false,
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating tickets for the issuer",
    enabled: canIssuerCreateTickets(props.issuerSettings),
    task: async (ctx, task) => {
      const numOfTicketsToCreate = countIssuerSettings(props.issuerSettings)

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
    },
  })

  tasks.add({
    title: "Configuring the issuer",
    task: async (_, task) => {
      const issuerTasks = createIssuerConfigurationTasks(props.issuerSettings)

      const subtasks = task.newListr<TokenIssuanceContext>(issuerTasks, {
        concurrent: canIssuerCreateTickets(props.issuerSettings),
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating trustlines to the issuer",
    task: async (ctx, task) => {
      // The wallets that will create trustlines to the issuer
      const accounts = [...ctx.operationalAccounts, ...ctx.holderAccounts]

      // The subtasks to create trustlines
      const trustlineSubtasks = createTrustlinesTasks(props.trustLineParams, accounts)
      const subtasks = task.newListr<TokenIssuanceContext>(trustlineSubtasks, {
        concurrent: true,
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Authorizing the holders to hold the token",
    enabled: hasIssuerRequireAuth(props.issuerSettings),
    task: async (ctx, task) => {
      // The wallets that will create trustlines to the issuer
      const accounts = [...ctx.operationalAccounts, ...ctx.holderAccounts]

      // The subtasks to create trustlines
      const trustlineSubtasks = authorizeTrustlinesTasks(props.trustLineParams.currency, accounts)
      const subtasks = task.newListr<TokenIssuanceContext>(trustlineSubtasks, {
        concurrent: false,
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Issuing the token",
    task: async (ctx) => {
      // The wallets that will receive the token
      const accounts = [...ctx.operationalAccounts, ...ctx.holderAccounts]

      // The subtasks to send payments
      const paymentSubtasks = paymentTasks(props.trustLineParams.currency, accounts)
      const subtasks = new Listr<TokenIssuanceContext>(paymentSubtasks, {
        concurrent: false,
        rendererOptions: { collapseSubtasks: false },
      })

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
    title: "Writing results to a file in the output directory",
    task: async (ctx) => {
      const time = new Date().toISOString()
      const pathFile = path.join(__dirname, "./output/", `results-${time}.json`)
      const result = {
        network: props.network,
        issuer: ctx.issuer,
        operationals: ctx.operationalAccounts,
        holders: ctx.holderAccounts,
      }
      writeFileSync(pathFile, JSON.stringify(result, null, 2))
    },
  })

  await tasks.run()
}
