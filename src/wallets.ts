import { Wallet } from "xrpl"

// https://xrpl.org/xrp-testnet-faucet.html
const MINT_WALLET_SEED = "" // Enter your seed/secret here (starting with an s)
const BUYER_WALLET_SEED = "" // Enter your seed/secret here (starting with an s)

export const MINT_WALLET = Wallet.fromSeed(MINT_WALLET_SEED)
export const BUYER_WALLET = Wallet.fromSeed(BUYER_WALLET_SEED)
