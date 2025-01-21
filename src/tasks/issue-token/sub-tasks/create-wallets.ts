import { ListrTask } from "listr2"
import { isUndefined } from "../../../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

type CreateWalletsProps = Pick<
  TokenIssuanceConfig,
  "holderAccountCount" | "operationalAccountCount" | "fundingOptions"
>

/**
 * Create the tasks to create wallets
 */
export const createWalletsTasks = ({
  operationalAccountCount,
  holderAccountCount,
  fundingOptions,
}: CreateWalletsProps): ListrTask<TokenIssuanceContext>[] => {
  return [
    {
      title: "Creating issuer",
      task: async (ctx) => {
        await ctx.client.fundWallet(ctx.issuer, fundingOptions)
      },
    },

    {
      title: "Creating operational account(s)",
      enabled: () => !isUndefined(operationalAccountCount) && operationalAccountCount > 0,
      task: async (ctx) => {
        const operationalAccounts = Array.from(
          { length: operationalAccountCount ?? 0 },
          async () => {
            const operationalAccount = await ctx.client.fundWallet(null, fundingOptions)
            return operationalAccount.wallet
          },
        )
        ctx.operationalAccounts = await Promise.all(operationalAccounts)
      },
      retry: 1,
    },
    {
      title: "Creating holder account(s)",
      enabled: () => holderAccountCount > 0,
      task: async (ctx) => {
        const holderAccounts = Array.from({ length: holderAccountCount ?? 0 }, async () => {
          const account = await ctx.client.fundWallet(null, fundingOptions)
          return account.wallet
        })
        ctx.holderAccounts = await Promise.all(holderAccounts)
      },
      retry: 1,
    },
  ]
}
