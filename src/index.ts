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
  createOffer,
} from "./transactions"
import { WALLET_2, WALLET_1 } from "./wallets"
import { getAccountNfts, getAccountOffers } from "./methods"

// Main function calls
// --------------------------------------------------

// Uncomment the functions you want to run.

/**
 * Send a Payment
 *
 * IMPORTANT: Write the IOU currency as a string, for example "MY_TOKEN", no need to convert it to HEX (it will be done in the function directly).
 * IMPORTANT 2: Write the XRP amount, not the drop amount. The XRP amount will be automatically converted to drops in the function.
 * --------------------------------------------------
 */
// sendPayment(
//   {
//     Destination: WALLET_2.address,
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
 * --------------------------------------------------
 *  _   _ _____ _____
 * | \ | |  ___|_   _|__
 * |  \| | |_    | |/ __|
 * | |\  |  _|   | |\__ \
 * |_| \_|_|     |_||___/
 *
 */

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
 * Get the NFTs of an account
 * --------------------------------------------------
 */
getAccountNfts({ account: WALLET_1.address, command: "account_nfts" })

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
 *
 * IMPORTANT: Write the IOU currency as a string, for example "MY_TOKEN", no need to convert it to HEX (it will be done in the function directly).
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

/**
 * Create a DEX offer.
 *
 * IMPORTANT: Write the IOU currency as a string, for example "MY_TOKEN", no need to convert it to HEX (it will be done in the function directly).
 * IMPORTANT 2: Write the XRP amount, not the drop amount. The XRP amount will be automatically converted to drops in the function.
 * --------------------------------------------------
 */
// createOffer(
//   {
//     OfferSequence: 37764909,
//     TakerGets: {
//       issuer: WALLET_1.address,
//       currency: "CYBERYA",
//       value: "10",
//     },
//     TakerPays: "60",
//   },
//   { wallet: WALLET_2 }
// )

/**
 * Get DEX offers from an account
 * --------------------------------------------------
 */
// getAccountOffers({ account: WALLET_2.address, command: "account_offers" })
