// organize-imports-ignore
import { convertCurrencyCodeToHex } from "./helpers"
import { nftAcceptOffer } from "./nft-accept-offer"
import { nftCancelOffer } from "./nft-cancel-offer"
import { nftCreateOffer } from "./nft-create-offer"
import { nftMint } from "./nft-mint"
import { sendPayment } from "./payments"
import { createTrustline } from "./trustline"
import { BUYER_WALLET, MINT_WALLET } from "./wallets"

// Uncomment the functions you want to run.

/**
 * ==================================
 * ========= Send a Payment =========
 * ==================================
 *
 * Send a payment on the XRP Ledger.
 *
 * @param {type} name - Description of parameter
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// sendPayment({
//   wallet: MINT_WALLET,
//   destination: BUYER_WALLET.address,
//   //   amount: "1", // In XRP if the amount is a string. If it is an object the amount is defining an IOU. See https://xrpl.org/basic-data-types.html#specifying-currency-amounts
//   amount: {
//     value: "10000",
//     currency: "SOMETHING",
//     issuer: MINT_WALLET.address,
//   }, // In XRP if the amount is a string. If it is an object the amount is defining an IOU. See https://xrpl.org/basic-data-types.html#specifying-currency-amounts
// })

/**
 * ==================================
 * ========== Mint an NFT ===========
 * ==================================
 *
 * Mint an NFT on the XRP Ledger.
 * You can use a Giphy link as the NFT Image you would like to mint.
 * https://giphy.com/
 *
 * @param {string} nftUri - Typically a link to the image (http://...)
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// nftMint({
//   nftUri: "https://media.giphy.com/media/rdma0nDFZMR32/giphy.gif",
//   wallet: MINT_WALLET,
// })

/**
 * ==========================================
 * ========== Create an NFT Offer ===========
 * ==========================================
 *
 * Create an offer to either buy or sell an NFT that you own.
 *
 * @param {string} amount - The amount you are selling or buying for.
 * @param {boolean} isSell - If true, the offer will be a sell offer.
 * @param {string} tokenId - The NFT ID to buy or sell.
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// nftCreateOffer({
//   amount: "9",
//   isSell: true,
//   //   owner: "rnDxRRBeWtwT2WpWB3Uht9HxrZusJfH98n",
//   tokenId: "000800008BB1B316B2292310C98DBD41FE965A5533A318FF2DCBAB9D00000002",
//   wallet: MINT_WALLET,
// })

/**
 * ==========================================
 * ========== Accept an NFT Offer ===========
 * ==========================================
 *
 * Accept a buy or sell offer.
 *
 * @param {string} buyOfferId - The buy offer ID.
 * @param {string} sellOfferId - The sell offer ID.
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// nftAcceptOffer({
//   buyOfferId: "379AF950F02625C1EEB7EADFEFC6CAF8FBF52A7DCC8D3C304B4D129E91177D0D",
//   //   sellOfferId: "379AF950F02625C1EEB7EADFEFC6CAF8FBF52A7DCC8D3C304B4D129E91177D0D",
//   wallet: BUYER_WALLET,
// })

/**
 * ==========================================
 * ========== Cancel an NFT Offer ===========
 * ==========================================
 *
 * Cancel an NFT Offer that a wallet created.
 *
 * @param {string[]} offers - A list of offer IDs.
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// nftCancelOffer({
//   offerIds: ["80AD166C1727AAE674C5F14A5A1F222392FB0B421777371BC5252782ABDB9C0E"],
//   wallet: MINT_WALLET,
// })

/**
 * ==========================================
 * ========== Create a Trustline ===========
 * ==========================================
 *
 * Create a trustline to hold an IOU (ERC20 equivalent for Ethereum).
 *
 * @param {xrpl.Trustset} props - A list of offer IDs.
 * @param {object} wallet - The wallet which will allow to sign the transaction and serve as the initiator of the transaction.
 * @return {void} Show in the terminal the result of that transaction.
 */
// createTrustline(
//   {
//     LimitAmount: {
//       issuer: MINT_WALLET.address,
//       // No need to convert the currency into hex, this is taken care of in the function itself. Just write your currency "DEMO_TOKEN" for example.
//       currency: "FLOFLO",
//       value: "1000000000",
//     },
//   },
//   BUYER_WALLET
// )
