import * as dotenv from "dotenv"
import { Wallet } from "xrpl"

dotenv.config()

// Testnet default accounts, if you forget to create a .env file in the root directory of this project. Check the README for more information.
const DEFAULT_WALLET_1_SEED = "sEdTJuwVunrCkA5hWLnmsYpMhEAVUdx" // rGgTDe9MUjB76LKvxsKKexNJ6QffnrCk6f
const DEFAULT_WALLET_2_SEED = "sEdTVEwMvifngC9d9k6Ft1Uy6becM5h" // rEEw5uLMbuZCNmqzCXQ4Xt4UvmnNUy4iFU

// https://xrpl.org/xrp-testnet-faucet.html
const WALLET_1_SEED = process.env.WALLET_1_SEED ?? DEFAULT_WALLET_1_SEED // Edit/create a .env file with a WALLET_1_SEED key
const WALLET_2_SEED = process.env.WALLET_2_SEED ?? DEFAULT_WALLET_2_SEED // Edit/create a .env file with a WALLET_2_SEED key

export const WALLET_1 = Wallet.fromSeed(WALLET_1_SEED)
export const WALLET_2 = Wallet.fromSeed(WALLET_2_SEED)
