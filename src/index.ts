// organize-imports-ignore
import { NFTokenCreateOfferFlags, TrustSetFlags } from "xrpl"
import { convertCurrencyCodeToHex } from "./helpers"
import {
  cancelNftOffer,
  acceptNftOffer,
  mintNft,
  sendPayment,
  createNftOffer,
  createTrustline,
} from "./transactions"
import { WALLET_2, WALLET_1 } from "./wallets"

// Main function calls
// --------------------------------------------------

// Uncomment the functions you want to run.

/**
 * Send a Payment
 */
// sendPayment(
//   {
//     Destination: WALLET_2.address,
//     // If the Amount is a string, then the Amount currency is XRP.
//     // If it is an Object the amount is defining an IOU. See https://xrpl.org/basic-data-types.html#specifying-currency-amounts
//     // Amount: "1",
//     Amount: {
//       value: "10000",
//       currency: "TEST_TOKEN",
//       issuer: WALLET_1.address,
//     },
//   },
//   { wallet: WALLET_1 }
// )

/**
 * Mint an NFT
 * --------------------------------------------------
 */
// mintNft(
//   {
//     URI: "https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy.gif",
//     NFTokenTaxon: 0,
//   },
//   { wallet: WALLET_1 }
// )

/**
 * Create an NFT offer
 * --------------------------------------------------
 */
// createNftOffer(
//   {
//     Amount: "10",
//     // Flags: NFTokenCreateOfferFlags.tfSellNFToken,
//     Owner: "r...", // Can also be WALLET_2.address for example.
//     NFTokenID: "...",
//   },
//   { wallet: WALLET_1 }
// )

/**
 * Accept an NFT offer
 * --------------------------------------------------
 */
// acceptNftOffer(
//   {
//     // NFTokenBuyOffer: "...",
//     NFTokenSellOffer: "...",
//   },
//   { wallet: WALLET_2 }
// )

/**
 * Cancel an NFT offer
 * --------------------------------------------------
 */
// cancelNftOffer(
//   {
//     NFTokenOffers: ["..."],
//   },
//   { wallet: WALLET_1 }
// )

/**
 * Create a trustline (to be able to hold a different token than XRP).
 * --------------------------------------------------
 */
// createTrustline(
//   {
//     Flags: TrustSetFlags.tfSetNoRipple,
//     LimitAmount: {
//       issuer: WALLET_1.address,
//       // No need to convert the currency into hex, this is taken care of in the function itself. Just write your currency "DEMO_TOKEN" for example.
//       currency: "TEST_TOKEN",
//       value: "1000000000",
//     },
//   },
//   { wallet: WALLET_2 }
// )
