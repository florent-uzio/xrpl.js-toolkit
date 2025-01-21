import { AccountSetAsfFlags } from "xrpl"
import { isUndefined } from "../../../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token.types"

/**
 * Determines whether the issuer can create tickets for account settings.
 * Tickets can only be created if the issuer does not require authorization for trustlines
 * and the number of issuer settings exceeds two.
 *
 * @param issuerSettings - The settings of the issuer account.
 * @returns A boolean indicating whether the issuer can create tickets.
 */
export const canIssuerCreateTicketsForAccountSet = (
  issuerSettings: TokenIssuanceConfig["issuerSettings"],
) => {
  return !hasIssuerRequireAuth(issuerSettings) && countIssuerSettings(issuerSettings) > 2
}

/**
 * Counts the total number of issuer account settings.
 * Includes `Domain`, `TickSize`, `TransferRate`, and any flags in `setFlags`.
 *
 * @param issuerSettings - The settings of the issuer account.
 * @returns The total count of issuer settings.
 */
export const countIssuerSettings = (issuerSettings: TokenIssuanceConfig["issuerSettings"]) => {
  let totalSettings = 0

  const { Domain, TickSize, TransferRate, setFlags } = issuerSettings ?? {}

  if (Domain || TickSize || TransferRate) totalSettings++

  if (!isUndefined(setFlags)) {
    const setFlagsArr = !isUndefined(setFlags) && Array.isArray(setFlags) ? setFlags : [setFlags]
    totalSettings = totalSettings + setFlagsArr.length
  }

  return totalSettings
}

/**
 * Checks whether the issuer settings has the `asfRequireAuth` flag enabled.
 * This flag indicates that the issuer requires trustline authorization.
 *
 * @param issuerSettings - The settings of the issuer account.
 * @returns A boolean indicating whether the `asfRequireAuth` flag is set.
 */
export const hasIssuerRequireAuth = (issuerSettings: TokenIssuanceConfig["issuerSettings"]) => {
  return issuerSettings?.setFlags?.includes(AccountSetAsfFlags.asfRequireAuth)
}

/**
 * Function to check if the issuer can create tickets to issue a token to the operational and holder accounts.
 * @returns A boolean
 */
export const hasEnoughHolders = (ctx: TokenIssuanceContext) => {
  return ctx.holderAccounts.length + ctx.operationalAccounts.length > 2
}
