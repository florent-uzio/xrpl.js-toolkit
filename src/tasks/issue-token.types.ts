import { Client, Wallet } from "xrpl"

export type IssueTokenContext = {
  client: Client
  issuer: Wallet
  operationals: Wallet[]
  holders: Wallet[]
}
