import { AccountSetAsfFlags } from "xrpl"
import { isUndefined } from "../../helpers"
import { TokenIssuanceConfig, TokenIssuanceContext } from "../issue-token/issue-token.types"

export const canIssuerCreateTicketsForAccountSet = (
  issuerSettings: TokenIssuanceConfig["issuerSettings"],
) => {
  return !issuerSettings?.setFlags?.includes(AccountSetAsfFlags.asfRequireAuth)
}

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
