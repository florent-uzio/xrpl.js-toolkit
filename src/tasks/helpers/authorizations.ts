import { AccountSetAsfFlags } from "xrpl"
import { IssueTokenProps } from "../issue-token/issue-token.types"

export const canCreateTicketsForIssuer = (issuerSettings: IssueTokenProps["issuerSettings"]) => {
  return !issuerSettings?.setFlags?.includes(AccountSetAsfFlags.asfRequireAuth)
}
