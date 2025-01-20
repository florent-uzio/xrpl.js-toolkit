import { ListrTask } from "listr2"
import { isUndefined } from "../../../helpers"
import { IssueTokenContext, IssueTokenProps } from "../issue-token.types"

type CreateWalletsProps = Pick<
  IssueTokenProps,
  "numHolderAccounts" | "numOperationalAccounts" | "fundingOptions"
>

/**
 * Create the tasks to create wallets
 */
export const createWalletsTasks = ({
  numOperationalAccounts,
  numHolderAccounts,
  fundingOptions,
}: CreateWalletsProps): ListrTask<IssueTokenContext>[] => {
  return [
    {
      title: "Creating issuer",
      task: async (ctx) => {
        await ctx.client.fundWallet(ctx.issuer, fundingOptions)
      },
    },

    {
      title: "Creating operational account(s)",
      enabled: () => !isUndefined(numOperationalAccounts) && numOperationalAccounts > 0,
      task: async (ctx) => {
        const operationalAccounts = Array.from(
          { length: numOperationalAccounts ?? 0 },
          async () => {
            const operationalAccount = await ctx.client.fundWallet(null, fundingOptions)
            return operationalAccount.wallet
          },
        )
        ctx.operationals = await Promise.all(operationalAccounts)
      },
      retry: 1,
    },

    {
      title: "Creating holder account(s)",
      enabled: () => !isUndefined(numHolderAccounts) && numHolderAccounts > 0,
      task: async (ctx) => {
        const holderAccounts = Array.from({ length: numHolderAccounts ?? 0 }, async () => {
          const account = await ctx.client.fundWallet(null, fundingOptions)
          return account.wallet
        })
        ctx.holders = await Promise.all(holderAccounts)
      },
      retry: 1,
    },
  ]
}
