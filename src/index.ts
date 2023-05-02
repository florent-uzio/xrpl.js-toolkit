// organize-imports-ignore
import { nftMint } from "./nft-mint"
import { sendPayment } from "./payments"
import { BUYER_WALLET, MINT_WALLET } from "./wallets"

// Send a Payment
// sendPayment({ wallet: MINT_WALLET, Destination: BUYER_WALLET.address, Amount: "0.1" })

// Mint an NFT - https://giphy.com/
nftMint({
  wallet: MINT_WALLET,
  nftUri: "https://media.giphy.com/media/rdma0nDFZMR32/giphy.gif",
})
