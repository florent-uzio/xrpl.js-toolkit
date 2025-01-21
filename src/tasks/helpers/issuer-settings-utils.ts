import { AccountSetAsfFlags } from "xrpl"
import { isUndefined } from "../../helpers"
import { TokenIssuanceConfig } from "../issue-token/issue-token.types"

export const canIssuerCreateTickets = (issuerSettings: TokenIssuanceConfig["issuerSettings"]) => {
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
