import { Wallet } from "xrpl"

// https://xrpl.org/xrp-testnet-faucet.html
const MINT_WALLET_SEED = "sEdVjZu79qkt25WpegyUybmuHiBfZTZ"
const BUYER_WALLET_SEED = "sEdT9ZM5xbiDXgDvaBs2dtTmF7FVxVa"

export const MINT_WALLET = Wallet.fromSeed(MINT_WALLET_SEED)
export const BUYER_WALLET = Wallet.fromSeed(BUYER_WALLET_SEED)
