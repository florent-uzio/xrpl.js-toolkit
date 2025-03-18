import { AccountSetAsfFlags, Client, TrustSetFlags, Wallet } from "xrpl"
import { submitMethod } from "../methods"
import { networks } from "../networks"
import { runTokenIssuanceTasks } from "../tasks"
import { TokenIssuanceContext } from "../tasks/issue-token/issue-token.types"
import { submitTxnAndWait } from "../transactions"

const USDB_TOKEN = "USDB"
const USDB_OFFER_AMOUNT = "9999999999999999e80"

const USDB_ALLOW_TOKEN = "USDBAllow"

export const setupUSDBAllowAccounts = async () => {
  console.log()
  console.log("Setting up USDBAllow accounts")
  return runTokenIssuanceTasks({
    network: networks.devnet.ripple,
    holderAccountCount: 2,
    trustLineParams: {
      currency: USDB_ALLOW_TOKEN,
      value: "1000000000",
    },
    issuerSettings: {
      setFlags: [
        AccountSetAsfFlags.asfRequireAuth,
        AccountSetAsfFlags.asfDefaultRipple,
        AccountSetAsfFlags.asfDisallowXRP,
        AccountSetAsfFlags.asfAllowTrustLineClawback,
      ],
      Domain: "USDBAllow.issuer.com",
    },
    fileNameExtension: `setup-${USDB_ALLOW_TOKEN}`,
    run: true,
  })
}

export const setupUSDBAccounts = async () => {
  console.log()
  console.log("Setting up USDB accounts")
  return runTokenIssuanceTasks({
    network: networks.devnet.ripple,
    holderAccountCount: 2,
    trustLineParams: {
      currency: USDB_TOKEN,
      value: "1000000000",
    },
    issuerSettings: {
      setFlags: [
        AccountSetAsfFlags.asfDepositAuth,
        AccountSetAsfFlags.asfDefaultRipple,
        AccountSetAsfFlags.asfDisallowXRP,
      ],
      Domain: "USDB.issuer.com",
      TickSize: 7,
    },
    mintToHolders: false,
    fileNameExtension: `setup-${USDB_TOKEN}`,
    run: true,
  })
}

export const createUSDBOffer = async (client: Client, issuer: Wallet, usdbAllowIssuer: string) => {
  await submitTxnAndWait({
    txn: {
      Account: issuer.address,
      TransactionType: "OfferCreate",
      TakerGets: {
        currency: USDB_TOKEN,
        value: USDB_OFFER_AMOUNT,
        issuer: issuer.address,
      },
      TakerPays: {
        currency: USDB_ALLOW_TOKEN,
        value: USDB_OFFER_AMOUNT,
        issuer: usdbAllowIssuer,
      },
    },
    client,
    wallet: issuer,
    showLogs: false,
  })
}

export const mintersTrustUsdb = async (
  client: Client,
  usdbCtx: TokenIssuanceContext,
  usdbAllowCtx: TokenIssuanceContext,
) => {
  // list of promises for each holder account of usdb allow
  const promises = usdbAllowCtx.holderAccounts.map((holder) => {
    return submitTxnAndWait({
      txn: {
        Account: holder.address,
        TransactionType: "TrustSet",
        LimitAmount: {
          currency: USDB_TOKEN,
          value: "1000000000",
          issuer: usdbCtx.issuer.address,
        },
      },
      client,
      wallet: Wallet.fromSeed(holder.seed ?? ""),
      showLogs: false,
    })
  })

  await Promise.all(promises)
}

export const usdbAllowIssuerAuthorizesUsdbIssuer = async (
  client: Client,
  usdbAllowCtx: TokenIssuanceContext,
  usdbIssuerAddress: string,
) => {
  await submitTxnAndWait({
    txn: {
      Account: usdbAllowCtx.issuer.address,
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: USDB_ALLOW_TOKEN,
        value: "0",
        issuer: usdbIssuerAddress,
      },
      Flags: TrustSetFlags.tfSetfAuth,
    },
    client,
    wallet: Wallet.fromSeed(usdbAllowCtx.issuer.seed ?? ""),
    showLogs: false,
  })
}

// usdb issuer trusts usdb allow issuer
export const usdbIssuerTrustsUsdbAllowIssuer = async (
  client: Client,
  usdbCtx: TokenIssuanceContext,
  usdbAllowCtx: TokenIssuanceContext,
) => {
  await submitTxnAndWait({
    txn: {
      Account: usdbCtx.issuer.address,
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: USDB_ALLOW_TOKEN,
        value: "1000000000",
        issuer: usdbAllowCtx.issuer.address,
      },
    },
    client,
    wallet: Wallet.fromSeed(usdbCtx.issuer.seed ?? ""),
    showLogs: false,
  })
}

export const setupAll = async () => {
  const client = new Client(networks.devnet.ripple)
  await client.connect()

  const usdbCtx = await setupUSDBAccounts()

  const usdbAllowCtx = await setupUSDBAllowAccounts()

  if (usdbCtx?.issuer && usdbCtx.issuer.seed && usdbAllowCtx) {
    console.log("Minters trust USDB")
    // await mintersTrustUsdb(client, usdbCtx, usdbAllowCtx)

    console.log("USDB issuer trusts USDB allow issuer")
    await usdbIssuerTrustsUsdbAllowIssuer(client, usdbCtx, usdbAllowCtx)

    console.log("USDBAllow issuer authorizes USDB issuer")
    await usdbAllowIssuerAuthorizesUsdbIssuer(client, usdbAllowCtx, usdbCtx.issuer.address)

    console.log("Create USDB offer")
    await createUSDBOffer(client, Wallet.fromSeed(usdbCtx.issuer.seed), usdbAllowCtx.issuer.address)
  }

  await client.disconnect()
}

export const makePaymentToMint = async (
  client: Client,
  senderWallet: Wallet,
  receiverWallet: Wallet,
  usdbAllowIssuer: string,
  usdbIssuer: string,
) => {
  await submitTxnAndWait({
    txn: {
      Account: senderWallet.address,
      TransactionType: "Payment",
      Destination: receiverWallet.address,
      Amount: {
        currency: USDB_TOKEN,
        value: "1",
        issuer: usdbIssuer,
      },
      SendMax: {
        currency: USDB_ALLOW_TOKEN,
        value: "1",
        issuer: usdbAllowIssuer,
      },
    },
    client,
    wallet: senderWallet,
    showLogs: true,
    showHash: false,
  })
}

export const showBookOffers = async (
  client: Client,
  usdbIssuerAddress: string,
  usdbAllowIssuerAddress: string,
) => {
  await submitMethod({
    request: {
      command: "book_offers",
      taker_gets: {
        currency: "USDB",
        value: "10",
        issuer: usdbIssuerAddress,
      },
      taker_pays: {
        currency: "USDBAllow",
        value: "10",
        issuer: usdbAllowIssuerAddress,
      },
    },
    client,
    run: true,
  })
}
