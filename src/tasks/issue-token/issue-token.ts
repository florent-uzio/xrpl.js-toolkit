import { writeFileSync } from "fs"
import { delay, Listr } from "listr2"
import path from "path"
import { AccountSetAsfFlags, Client, Wallet } from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"
import { submitMethod } from "../../methods"
import { submitTxnAndWait } from "../../transactions"
import {
  canIssuerCreateTicketsForAccountSet,
  countIssuerSettings,
  hasEnoughOperational,
  hasEnoughOperationalAndHolders,
  issuerHasAnyFlags,
} from "../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "./issue-token.types"
import {
  authorizeTrustlinesTasks,
  createIssuerConfigurationTasks,
  createTrustlinesTasks,
  createWalletsTasks,
  depositPreAuthTasks,
  paymentTasks,
} from "./sub-tasks"

/**
 * Tasks to issue a token and create several wallets.
 */
export const runTokenIssuanceTasks = async (props: TokenIssuanceConfig) => {
  if (!props.run) {
    console.log("Token issuance script is disabled, set run to 'true'.")
    return
  }

  const tasks = new Listr<TokenIssuanceContext>([], {
    concurrent: false,
    rendererOptions: {
      collapseSubtasks: false,
    },
  })

  tasks.add({
    title: "Initializing the context",
    task: async (ctx) => {
      ctx.client = new Client(props.network)
      ctx.issuer = Wallet.generate()
      ctx.operationalAccounts = []
      ctx.holderAccounts = []
      ctx.issuerTickets = []
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
    task: (_, task) => {
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
    title: "Creating tickets for the issuer settings",
    enabled: canIssuerCreateTicketsForAccountSet(props.issuerSettings),
    task: async (ctx, _) => {
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
    task: (_, task) => {
      const issuerTasks = createIssuerConfigurationTasks(props.issuerSettings)

      const subtasks = task.newListr<TokenIssuanceContext>(issuerTasks, {
        concurrent: canIssuerCreateTicketsForAccountSet(props.issuerSettings),
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating trustlines to the issuer",
    skip: (ctx) => !hasEnoughOperationalAndHolders(ctx, 1),
    task: (ctx, task) => {
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
    title: "Creating tickets to then authorize the wallets",
    skip: (ctx) => !hasEnoughOperationalAndHolders(ctx),
    enabled: issuerHasAnyFlags(props.issuerSettings, [AccountSetAsfFlags.asfRequireAuth]),
    task: async (ctx, _) => {
      const numOfTicketsToCreate = ctx.holderAccounts.length + ctx.operationalAccounts.length

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
    title: "Authorizing the wallets to hold the token",
    enabled: issuerHasAnyFlags(props.issuerSettings, [AccountSetAsfFlags.asfRequireAuth]),
    task: (ctx, task) => {
      const accounts = [...ctx.operationalAccounts, ...ctx.holderAccounts]

      const trustlineSubtasks = authorizeTrustlinesTasks(props.trustLineParams.currency, accounts)
      const subtasks = task.newListr<TokenIssuanceContext>(trustlineSubtasks, {
        concurrent: hasEnoughOperationalAndHolders(ctx),
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating tickets to authorize deposit for operational wallets",
    skip: (ctx) => !hasEnoughOperational(ctx),
    enabled: issuerHasAnyFlags(props.issuerSettings, [AccountSetAsfFlags.asfDepositAuth]),
    task: async (ctx, _) => {
      const numOfTicketsToCreate = ctx.operationalAccounts.length

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
    title: "Authorizing the operational wallets to send tokens to the issuer",
    enabled: issuerHasAnyFlags(props.issuerSettings, [AccountSetAsfFlags.asfDepositAuth]),
    task: (ctx) => {
      const depositPreAuthSubtasks = depositPreAuthTasks(ctx.operationalAccounts)
      const subtasks = new Listr<TokenIssuanceContext>(depositPreAuthSubtasks, {
        concurrent: hasEnoughOperational(ctx),
        rendererOptions: { collapseSubtasks: false },
      })

      return subtasks
    },
  })

  tasks.add({
    title: "Creating tickets to send the token",
    skip: (ctx) => !hasEnoughOperationalAndHolders(ctx),
    task: async (ctx, _) => {
      const numOfTicketsToCreate = ctx.holderAccounts.length + ctx.operationalAccounts.length

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
    title: "Issuing the token to the operational and holder wallets",
    skip: (ctx) => {
      return !hasEnoughOperationalAndHolders(ctx, 1)
    },
    task: async (ctx) => {
      // The wallets that will receive the token
      const accounts = [...ctx.operationalAccounts, ...ctx.holderAccounts]
      const { currency, value } = props.trustLineParams

      // The subtasks to send payments
      const paymentSubtasks = paymentTasks(currency, value, accounts)
      const subtasks = new Listr<TokenIssuanceContext>(paymentSubtasks, {
        concurrent: hasEnoughOperationalAndHolders(ctx),
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
