import { Client, Wallet } from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"

export type IssueTokenContext = {
  client: Client
  issuer: Wallet
  operationals: Wallet[]
  holders: Wallet[]
  issuerTickets: Ticket[]
}
