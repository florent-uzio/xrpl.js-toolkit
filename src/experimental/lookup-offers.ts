// import { BookOfferCurrency } from "xrpl"
// import { convertAmount, convertHexCurrencyCodeToString } from "../helpers"
// import { TxnCommons } from "../models"

// type LookupOffersProps = {
//   weWant: BookOfferCurrency
//   weWantAmount: string
//   weSpend: BookOfferCurrency
//   weSpendAmount: string
// }

// /**
//  * Converts the function described in https://xrpl.org/trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange to typescript.
//  */
// export const lookupOffers = async (
//   { weSpend, weSpendAmount, weWant, weWantAmount }: LookupOffersProps,
//   { client }: TxnCommons,
// ) => {
//   console.log("******* LET'S LOOKUP OFFERS *******")
//   console.log()

//   // Convert the amounts to drops if the currency is XRP
//   weSpendAmount =
//     weSpend.currency.toUpperCase() === "XRP"
//       ? convertAmount({ amount: weSpendAmount, to: "drops" })
//       : weSpendAmount

//   weWantAmount =
//     weWant.currency.toUpperCase() === "XRP"
//       ? convertAmount({ amount: weWantAmount, to: "drops" })
//       : weWantAmount

//   // "Quality" is defined as TakerPays / TakerGets. The lower the "quality"
//   // number, the better the proposed exchange rate is for the taker.
//   // The quality is rounded to a number of significant digits based on the
//   // issuer's TickSize value (or the lesser of the two for token-token trades.)
//   const proposed_quality = +weSpendAmount / +weWantAmount

//   const orderbook_resp = await getBookOffers({
//     methodRequest: {
//       command: "book_offers",
//       taker: wallet.address,
//       taker_gets: { ...weWant },
//       taker_pays: { ...weSpend },
//       ledger_index: "current",
//     },
//     client,
//   })

//   const sellOffers = orderbook_resp.result.offers

//   let running_total = 0

//   if (!sellOffers) {
//     console.log("No Sell Offers in the matching book. Offer probably won't execute immediately.")
//   } else {
//     for (const sellOffer of sellOffers) {
//       if (sellOffer.quality && +sellOffer.quality <= proposed_quality) {
//         console.log(
//           `Matching Offer found with sequence: ${sellOffer.Sequence}, the owner has a balance of ${
//             sellOffer.owner_funds
//           } ${convertHexCurrencyCodeToString(weWant.currency)}`,
//         )

//         running_total = running_total + (sellOffer.owner_funds ? +sellOffer.owner_funds : 0)

//         if (running_total >= +weWantAmount) {
//           console.log("Full Offer will probably fill")
//           break
//         }
//       } else {
//         // Offers are in ascending quality order, so no others after this will match, either
//         console.log("Remaining orders too expensive.")
//         break
//       }

//       console.log(
//         `Total matched: ${Math.min(running_total, +weWantAmount)} ${convertHexCurrencyCodeToString(
//           weWant.currency,
//         )}`,
//       )

//       if (running_total > 0 && running_total < +weWantAmount) {
//         console.log(
//           `Remaining ${+weWantAmount - running_total} ${
//             weWant.currency
//           } would probably be placed on top of the order book.`,
//         )
//       }
//     }
//   }

//   if (running_total == 0) {
//     // If part of the Offer was expected to cross, then the rest would be placed
//     // at the top of the order book. If none did, then there might be other
//     // Offers going the same direction as ours already on the books with an
//     // equal or better rate. This code counts how much liquidity is likely to be
//     // above ours.

//     // Unlike above, this time we check for Offers going the same direction as
//     // ours, so TakerGets and TakerPays are reversed from the previous
//     // book_offers request.
//     const orderbook2_resp = await getBookOffers({
//       methodRequest: {
//         command: "book_offers",
//         taker: wallet.address,
//         ledger_index: "current",
//         taker_gets: { ...weSpend },
//         taker_pays: { ...weWant },
//       },
//       client,
//     })

//     // Since TakerGets/TakerPays are reversed, the quality is the inverse.
//     // You could also calculate this as 1/proposed_quality.
//     const offered_quality = +weWantAmount / +weSpendAmount

//     const offers2 = orderbook2_resp.result.offers

//     let tally_currency = weSpend.currency
//     if (tally_currency == "XRP") {
//       tally_currency = "drops of XRP"
//     }

//     let running_total2 = 0

//     if (!offers2) {
//       console.log(`No similar Offers in the book. Ours would be the first.`)
//     } else {
//       for (const offer of offers2) {
//         if (offer.quality && +offer.quality <= offered_quality) {
//           console.log(`Existing offer found, funded with ${offer.owner_funds} ${tally_currency}`)

//           running_total2 = running_total2 + (offer.owner_funds ? +offer.owner_funds : 0)
//         } else {
//           console.log(`Remaining orders are below where ours would be placed.`)
//           break
//         }
//       }

//       console.log(`Our Offer would be placed below at least ${running_total2} ${tally_currency}`)

//       if (running_total > 0 && running_total < +weWantAmount) {
//         console.log(
//           `Remaining ${
//             +weWantAmount - running_total
//           } ${tally_currency} will probably be placed on top of the order book.`,
//         )
//       }
//     }
//   }
// }
