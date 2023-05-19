import * as dotenv from "dotenv"
import { Wallet } from "xrpl"

dotenv.config()

// Testnet default accounts, if you forget to create a .env file in the root directory of this project. Check the README for more information.
const DEFAULT_WALLET_1_SEED = "sEd7HTHJVuaEF3kNRiDBHgyPMSidAq6" // rJWdrBE4GXsdBq3e2HPFG6QJvwYgKMg5zp
const DEFAULT_WALLET_2_SEED = "sEdVJX6VNa5CnyLHjj3E6iUV2iiJDHX" // rNLTsHmWobFCtpTEcUjYcLLfLpvqXguosJ
const DEFAULT_WALLET_3_SEED = "sEd7wTQYsS5NQTajXPcAJQFLwkeVxay" // rGJ5aiiZP41qbszhWRVrXiZQpw1tM42w59

// https://xrpl.org/xrp-testnet-faucet.html
const WALLET_1_SEED = process.env.WALLET_1_SEED ?? DEFAULT_WALLET_1_SEED // Edit/create a .env file with a WALLET_1_SEED key
const WALLET_2_SEED = process.env.WALLET_2_SEED ?? DEFAULT_WALLET_2_SEED // Edit/create a .env file with a WALLET_2_SEED key
const WALLET_3_SEED = process.env.WALLET_3_SEED ?? DEFAULT_WALLET_3_SEED // Edit/create a .env file with a WALLET_3_SEED key

export const WALLET_1 = Wallet.fromSeed(WALLET_1_SEED)
export const WALLET_2 = Wallet.fromSeed(WALLET_2_SEED)
export const WALLET_3 = Wallet.fromSeed(WALLET_3_SEED)
