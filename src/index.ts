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
import {
  getAccountCurrencies,
  getAccountInfo,
  getAccountLines,
  getAccountNfts,
  getAccountOffers,
} from "./methods"

/**
 *  ____                                  _
 * |  _ \ __ _ _   _ _ __ ___   ___ _ __ | |_ ___
 * | |_) / _` | | | | '_ ` _ \ / _ \ '_ \| __/ __|
 * |  __/ (_| | |_| | | | | | |  __/ | | | |_\__ \
 * |_|   \__,_|\__, |_| |_| |_|\___|_| |_|\__|___/
 *             |___/
 */

/**
 * Send a Payment
 *
 * https://xrpl.org/payment.html
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
 *  _   _ _____ _____
 * | \ | |  ___|_   _|__
 * |  \| | |_    | |/ __|
 * | |\  |  _|   | |\__ \
 * |_| \_|_|     |_||___/
 *
 */

/**
 * Mint an NFT
 *
 * https://xrpl.org/nftokenmint.html
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
 *
 * https://xrpl.org/nftokencreateoffer.html
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
 *
 * https://xrpl.org/nftokenacceptoffer.html
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
 *
 * https://xrpl.org/nftokencanceloffer.html
 * --------------------------------------------------
 */
// cancelNftOffer(
//   {
//     NFTokenOffers: ["..."],
//   },
//   { wallet: WALLET_1 }
// )

/**
 *  _____               _   _ _
 * |_   _| __ _   _ ___| |_| (_)_ __   ___  ___
 *   | || '__| | | / __| __| | | '_ \ / _ \/ __|
 *   | || |  | |_| \__ \ |_| | | | | |  __/\__ \
 *   |_||_|   \__,_|___/\__|_|_|_| |_|\___||___/
 */

/**
 * Create a trustline (to be able to hold a different token than XRP).
 * https://xrpl.org/trustset.html
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
 *  ____  _______  __
 * |  _ \| ____\ \/ /
 * | | | |  _|  \  /
 * | |_| | |___ /  \
 * |____/|_____/_/\_\
 */

/**
 * Create a DEX offer.
 *
 * https://xrpl.org/offercreate.html#offercreate
 *
 * IMPORTANT: Write the IOU currency as a string, for example "MY_TOKEN", no need to convert it to HEX (it will be done in the function directly).
 * IMPORTANT 2: Write the XRP amount, not the drop amount. The XRP amount will be automatically converted to drops in the function.
 * --------------------------------------------------
 */
// createOffer(
//   {
//     TakerGets: {
//       issuer: WALLET_1.address,
//       currency: "TEST_TOKEN",
//       value: "10",
//     },
//     TakerPays: "60",
//   },
//   { wallet: WALLET_2 }
// )

/**
 *     _                             _
 *    / \   ___ ___ ___  _   _ _ __ | |_
 *   / _ \ / __/ __/ _ \| | | | '_ \| __|
 *  / ___ \ (_| (_| (_) | |_| | | | | |_
 * /_/   \_\___\___\___/ \__,_|_| |_|\__|
 */

// getAccountCurrencies({ account: WALLET_1.address, command: "account_currencies" })

// getAccountInfo({ account: WALLET_1.address, command: "account_info" })

// getAccountNfts({ account: WALLET_1.address, command: "account_nfts" })

// getAccountLines({ account: WALLET_2.address, command: "account_lines" })

// getAccountOffers({ account: WALLET_2.address, command: "account_offers" })
