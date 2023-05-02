import { sendPayment } from "./payment"
import { BUYER_WALLET, MINT_WALLET } from "./wallets"

// Send a Payment
sendPayment({ wallet: MINT_WALLET, Destination: BUYER_WALLET.address, Amount: "0.1" })

// Mint an NFT
// nftMint()
