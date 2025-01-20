import { AccountSet, AccountSetAsfFlags, Client, FundingOptions, Wallet } from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"

export type IssueTokenContext = {
  client: Client
  issuer: Wallet
  operationals: Wallet[]
  holders: Wallet[]
  issuerTickets: Ticket[]
}

export type IssueTokenProps = {
  network: string
  numOperationalAccounts?: number
  numHolderAccounts?: number
  fundingOptions?: FundingOptions
  issuerSettings?: {
    setFlags?: AccountSetAsfFlags[]
  } & Pick<AccountSet, "Domain" | "TickSize" | "TransferRate" | "ClearFlag">
}
