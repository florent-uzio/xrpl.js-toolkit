// organize-imports-ignore
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
// sendPayment({
//   wallet: WALLET_1,
//   destination: WALLET_2.address,
//   amount: "1", // In XRP if the amount is a string. If it is an object the amount is defining an IOU. See https://xrpl.org/basic-data-types.html#specifying-currency-amounts
//   //   amount: {
//   //     value: "10000",
//   //     currency: "SOMETHING",
//   //     issuer: WALLET_1.address,
//   //   }, // In XRP if the amount is a string. If it is an object the amount is defining an IOU. See https://xrpl.org/basic-data-types.html#specifying-currency-amounts
// })

/**
 * Mint an NFT
 * --------------------------------------------------
 */
// mintNft({
//   nftUri: "https://media.giphy.com/media/rdma0nDFZMR32/giphy.gif",
//   wallet: WALLET_1,
// })

/**
 * Create an NFT offer
 * --------------------------------------------------
 */
// createNftOffer({
//   amount: "9",
//   isSell: true,
//   //   owner: "rnDxRRBeWtwT2WpWB3Uht9HxrZusJfH98n",
//   tokenId: "000800008BB1B316B2292310C98DBD41FE965A5533A318FF2DCBAB9D00000002",
//   wallet: WALLET_1,
// })

/**
 * Accept an NFT offer
 * --------------------------------------------------
 */
// acceptNftOffer({
//   buyOfferId: "379AF950F02625C1EEB7EADFEFC6CAF8FBF52A7DCC8D3C304B4D129E91177D0D",
//   //   sellOfferId: "379AF950F02625C1EEB7EADFEFC6CAF8FBF52A7DCC8D3C304B4D129E91177D0D",
//   wallet: WALLET_2,
// })

/**
 * Cancel an NFT offer
 * --------------------------------------------------
 */
// cancelNftOffer({
//   offerIds: ["80AD166C1727AAE674C5F14A5A1F222392FB0B421777371BC5252782ABDB9C0E"],
//   wallet: WALLET_1,
// })

/**
 * Create a trustline (to be able to hold a token different than XRP).
 * --------------------------------------------------
 */
// createTrustline(
//   {
//     LimitAmount: {
//       issuer: WALLET_1.address,
//       // No need to convert the currency into hex, this is taken care of in the function itself. Just write your currency "DEMO_TOKEN" for example.
//       currency: "MY_TOKEN",
//       value: "1000000000",
//     },
//   },
//   WALLET_2
// )
