import {
  AccountSet,
  AccountSetAsfFlags,
  Client,
  CredentialCreate,
  FundingOptions,
  IssuedCurrencyAmount,
  TrustSet,
  Wallet,
} from "xrpl"
import { Ticket } from "xrpl/dist/npm/models/ledger"

/**
 * Represents the context required for issuing tokens.
 */
export type TokenIssuanceContext = {
  /** XRP Ledger client instance for network interactions */
  client: Client

  /** The wallet responsible for issuing tokens */
  issuer: Wallet

  /** Operational wallets to assist in the token issuance process */
  operationalAccounts: Wallet[]

  /** Wallets that will hold the issued tokens */
  holderAccounts: Wallet[]

  /** Pre-created tickets for the issuer (to manage transactions) */
  issuerTickets: Ticket[]
}

/**
 * Configuration options for issuing tokens.
 */
export type TokenIssuanceConfig = {
  /** XRP Ledger network identifier (e.g., "mainnet", "testnet", etc.) */
  network: string

  /** Number of operational accounts to create (optional) */
  operationalAccountCount?: number

  /** Number of holder accounts to create (optional) */
  holderAccountCount: number

  /** Options for funding operational and holder accounts */
  fundingOptions?: FundingOptions

  /** Issuer wallet settings, such as flags and transaction parameters */
  issuerSettings?: {
    /** Set flags for the issuer wallet */
    setFlags?: AccountSetAsfFlags[]

    /** Optional issuer-specific settings */
  } & Pick<AccountSet, "Domain" | "TickSize" | "TransferRate">

  /** Parameters for creating trust lines */
  trustLineParams: Pick<TrustSet, "Flags"> & {
    /** The currency code for the trust line */
    currency: IssuedCurrencyAmount["currency"]

    /** The trust line's maximum value */
    value: IssuedCurrencyAmount["value"]
  }

  /** If disabled, the script will not run */
  run?: boolean
}

type Credential = {
  subject: Recipient["id"]
} & Pick<CredentialCreate, "CredentialType" | "URI" | "Expiration">

type AccountSettings = {
  accountSetAsfFlags?: AccountSetAsfFlags[]
} & Pick<
  AccountSet,
  "Domain" | "TickSize" | "TransferRate" | "NFTokenMinter" | "EmailHash" | "MessageKey"
>

type RequireAuthIssuer = {
  id: number
  credentials: Credential[]
  accountSetAsfFlags: (AccountSetAsfFlags.asfRequireAuth | AccountSetAsfFlags)[]
  trustLineAuthorize: Recipient["id"][]
} & Omit<AccountSettings, "accountSetAsfFlags">

type NonRequireAuthIssuer = {
  id: number
  credentials: Credential[]
  accountSetAsfFlags?: Exclude<AccountSetAsfFlags, AccountSetAsfFlags.asfRequireAuth>[]
  trustLineAuthorize?: never
} & Omit<AccountSettings, "accountSetAsfFlags">

type Issuer = RequireAuthIssuer | NonRequireAuthIssuer

type Recipient = {
  id: number
  accountSettings?: {
    accountSetAsfFlags?: AccountSetAsfFlags[]
  } & Pick<AccountSet, "Domain" | "EmailHash" | "MessageKey">
  trustLineSettings: {
    currency: IssuedCurrencyAmount["currency"]
    value: IssuedCurrencyAmount["value"]
    // reference to the issuer
    issuerId: Issuer["id"]
  }
}

export type TokenIssuanceConfig2 = {
  /** XRP Ledger network identifier (e.g., "mainnet", "testnet", etc.) */
  network: string

  /** Number of operational accounts to create (optional) */
  // operationalAccountCount?: number

  /** Number of issuer accounts to create */
  issuerAccountCount: number

  /** Number of recipient accounts to create  */
  recipientAccountCount: number

  /** Options for funding operational and holder accounts */
  fundingOptions?: FundingOptions

  /** Issuer accounts to create and their settings */
  issuers: Issuer[]

  recipients: Recipient[]

  /** If disabled, the script will not run */
  run?: boolean
}

const test: TokenIssuanceConfig2 = {
  network: "mainnet",
  issuerAccountCount: 1,
  recipientAccountCount: 1,
  issuers: [
    {
      id: 1,
      credentials: [
        {
          subject: 1,
          CredentialType: "test-creds",
          URI: "https://example.com",
          // Expiration: "2025-01-01"
        },
      ],

      accountSetAsfFlags: [AccountSetAsfFlags.asfRequireAuth, AccountSetAsfFlags.asfDefaultRipple],
      trustLineAuthorize: [1],
    },
  ],
  recipients: [
    {
      id: 1,
      trustLineSettings: {
        currency: "USD",
        value: "100",
        issuerId: 1,
      },
    },
  ],
}
