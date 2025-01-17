import { writeFileSync } from "fs"
import { delay, Listr } from "listr2"
import path from "path"
import { Client, FundingOptions, Wallet } from "xrpl"
import { isUndefined } from "../helpers"
import { IssueTokenContext } from "./issue-token.types"

type IssueTokenProps = {
  network: string
  numOperationalAccounts?: number
  numHolderAccounts?: number
  fundingOptions?: FundingOptions
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
        (ctx.holders = [])
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
    title: "Disconnect the client",
    task: async (ctx) => {
      await ctx.client.disconnect()
    },
  })

  tasks.add({
    title: "Writing results to a file",
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
      delay(random(3, 6))
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
      delay(random(3, 6))
      const holderAccounts = Array.from({ length: numHolderAccounts ?? 0 }, async () => {
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
