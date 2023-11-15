import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { Currency } from "xrpl/dist/npm/models/common"
import { showTxBalanceChanges } from "./helpers"
import { networks } from "./networks"
import { WALLET_1 } from "./wallets"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.RIPPLE_MAINNET)

  // Do not comment
  await client.connect()

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
  // await sendPayment({
  //   txn: {
  //     Flags: PaymentFlags.tfPartialPayment,
  //     Destination: WALLET_3.address,
  //     // Amount: "1",
  //     Amount: {
  //       value: "15",
  //       currency: TOKEN,
  //       issuer: WALLET_1.address,
  //     },
  //   },
  //   wallet: WALLET_2,
  // })

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
  // await mintNft(
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
  // await createNftOffer(
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
  // await acceptNftOffer(
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
  // await cancelNftOffer(
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
  // await createTrustline({
  //   txn: {
  //     Flags: TrustSetFlags.tfSetNoRipple,
  //     LimitAmount: {
  //       issuer: WALLET_1.address,
  //       // No need to convert the currency into hex, this is taken care of in the function itself. Just write your currency "DEMO_TOKEN" for example.
  //       currency: TOKEN,
  //       value: "30000000",
  //     },
  //   },
  //   wallet: WALLET_3,
  // })

  /**
   *  ____  _______  __
   * |  _ \| ____\ \/ /
   * | | | |  _|  \  /
   * | |_| | |___ /  \
   * |____/|_____/_/\_\
   */

  // await lookupOffers(
  //   {
  //     weWant: { currency: TOKEN, issuer: WALLET_1.address },
  //     weWantAmount: "1000000000000",
  //     weSpend: { currency: "XRP" },
  //     weSpendAmount: "70",
  //   },
  //   { wallet: WALLET_3, showLogs: false }
  // )

  // await getBuyQuote(
  //   {
  //     weWant: {
  //       currency: "USD",
  //       issuer: GATEHUB_ISSUER_ADDRESSES.USD, // WALLET_1.address,
  //     },
  //     weWantAmountOfToken: 50,
  //     counterCurrency: {
  //       currency: "XRP",
  //       // issuer: GATEHUB_ISSUER_ADDRESSES.USD,
  //     },
  //     taker: WALLET_3.address,
  //   },
  //   { showLogs: false }
  // )

  // await getSellQuote(
  //   {
  //     weSell: {
  //       currency: "XRP",
  //       //issuer: GATEHUB_ISSUER_ADDRESSES.USD,
  //     },
  //     weSellAmountOfTokens: 50,
  //     counterCurrency: {
  //       currency: "USD",
  //       issuer: GATEHUB_ISSUER_ADDRESSES.USD, // Gatehub USD issuing address
  //     },
  //     taker: WALLET_2.address,
  //   },
  //   { showLogs: false }
  // )

  // await createOffer(
  //   {
  //     // This is what the account accepting the offer will pay the `wallet` address (2nd argument to this createOffer).
  //     TakerPays: {
  //       issuer: WALLET_1.address,
  //       currency: TOKEN,
  //       value: "50",
  //     },
  //     // This is what the account accepting the offer will receive by the `wallet` address (2nd argument to this createOffer).
  //     TakerGets: {
  //       issuer: WALLET_1.address,
  //       currency: "DEX_TOKEN",
  //       value: "89",
  //     },
  //   },
  //   { wallet: WALLET_2 }
  // )

  // await cancelOffer({ OfferSequence: 38398319 }, { wallet: WALLET_2 })

  /**
   *     _                             _   ____       _
   *    / \   ___ ___ ___  _   _ _ __ | |_/ ___|  ___| |_
   *   / _ \ / __/ __/ _ \| | | | '_ \| __\___ \ / _ \ __|
   *  / ___ \ (_| (_| (_) | |_| | | | | |_ ___) |  __/ |_
   * /_/   \_\___\___\___/ \__,_|_| |_|\__|____/ \___|\__|
   */

  /**
   * Create an AccountSet.
   *
   * https://xrpl.org/accountset.html
   * --------------------------------------------------
   */
  // await accountSet({ SetFlag: AccountSetAsfFlags.asfDefaultRipple }, { wallet: WALLET_1 })

  /**
   *   _____
   *  | ____|___  ___ _ __ _____      _____
   *  |  _| / __|/ __| '__/ _ \ \ /\ / / __|
   *  | |___\__ \ (__| | | (_) \ V  V /\__ \
   *  |_____|___/\___|_|  \___/ \_/\_/ |___/
   */

  // await createEscrow(
  //   {
  //     Amount: "5", // in XRP
  //     // Condition: generateConditionAndFulfillment().condition, // Optional
  //     Destination: WALLET_2.address,
  //     FinishAfter: isoTimeToRippleTime(dayjs().add(1, "minute").toDate()),
  //   },
  //   { wallet: WALLET_1 }
  // )

  // await finishEscrow(
  //   {
  //     // Condition: "A02580205E2935435865EA7049B17812CFF41EFFCD8B7CD92D1F6FB57D6D61BDF48795AA810120", // Optional
  //     // Fulfillment: "A0228020E7EE88B735FDFD0578B961B0D7649672124C73912536D4B3902CB38677EE80BF", // Optional
  //     Owner: WALLET_1.address,
  //     OfferSequence: 1538416,
  //   },
  //   { wallet: WALLET_2 }
  // )

  // await cancelEscrow(
  //   {
  //     Owner: WALLET_1.address,
  //     OfferSequence: 1538316,
  //   },
  //   { wallet: WALLET_1 }
  // )

  /**
   *     _    __  __ __  __
   *    / \  |  \/  |  \/  |
   *   / _ \ | |\/| | |\/| |
   *  / ___ \| |  | | |  | |
   * /_/   \_\_|  |_|_|  |_|
   *
   * Attention
   * Automated Market Maker (AMM) functionality is part of the proposed XLS-30d extension to the XRP Ledger protocol.
   * You can use these functions on AMM test networks, but there isn't an official amendment and they aren't available on the production Mainnet.
   *
   * WARNING: The AMM types are not part of xrpl.js 2.10.0. Thus the AMM functions below don't work.
   */

  // Update accordingly
  const asset: Currency = {
    currency: "XRP",
  }

  // Update accordingly
  const asset2: Currency = {
    currency: TOKEN,
    issuer: WALLET_1.address,
  }

  // await createAMM(
  //   {
  //     Amount: "1000",
  //     Amount2: {
  //       issuer: WALLET_1.address,
  //       currency: TOKEN,
  //       value: "2000",
  //     },
  //     TradingFee: 500,
  //   },
  //   {
  //     wallet: WALLET_2,
  //   }
  // )

  // await bidAMM(
  //   {
  //     Asset: asset,
  //     Asset2: asset2,
  //     BidMin: "1000",
  //   },
  //   { wallet: WALLET_3 }
  // )

  // await depositInAMM(
  //   {
  //     Asset: asset,
  //     Amount: {
  //       currency: TOKEN,
  //       issuer: WALLET_1.address,
  //       value: "10000",
  //     },
  //     Asset2: asset2,
  //     Flags: AMMDepositFlags.tfSingleAsset,
  //   },
  //   { wallet: WALLET_3 }
  // )

  // await voteInAMM(
  //   {
  //     TradingFee: 600,
  //     Asset: asset,
  //     Asset2: asset2,
  //   },
  //   { wallet: WALLET_3 }
  // )

  // await withdrawFromAMM(
  //   {
  //     Asset: asset,
  //     Asset2: asset2,
  //     Amount: { currency: TOKEN, issuer: WALLET_1.address, value: "10" },
  //     Flags: AMMWithdrawFlags.tfSingleAsset,
  //   },
  //   { wallet: WALLET_3 }
  // )

  /**
   *   ____       _      _
   *  |  _ \  ___| | ___| |_ ___
   *  | | | |/ _ \ |/ _ \ __/ _ \
   *  | |_| |  __/ |  __/ ||  __/
   *  |____/ \___|_|\___|\__\___|
   */

  // await deleteAccount(
  //   {
  //     Destination: WALLET_2.address,
  //   },
  //   {
  //     wallet: WALLET_1,
  //   },
  // )

  /**
   *    ____ _                _                _
   *  / ___| | __ ___      _| |__   __ _  ___| | __
   * | |   | |/ _` \ \ /\ / / '_ \ / _` |/ __| |/ /
   * | |___| | (_| |\ V  V /| |_) | (_| | (__|   <
   *  \____|_|\__,_| \_/\_/ |_.__/ \__,_|\___|_|\_\
   *
   */

  // /!\ Only available on Devnet as of 30th of August 2023
  // await clawback(
  //   {
  //     Amount: {
  //       issuer: WALLET_2.address,
  //       currency: TOKEN,
  //       value: "10",
  //     },
  //   },
  //   { wallet: WALLET_1 },
  // )

  /**
   *  ____  _                       _     _     _   ____       _
   * / ___|(_) __ _ _ __   ___ _ __| |   (_)___| |_/ ___|  ___| |_
   * \___ \| |/ _` | '_ \ / _ \ '__| |   | / __| __\___ \ / _ \ __|
   *  ___) | | (_| | | | |  __/ |  | |___| \__ \ |_ ___) |  __/ |_
   * |____/|_|\__, |_| |_|\___|_|  |_____|_|___/\__|____/ \___|\__|
   *          |___/
   */

  // Prepare the signers
  // const signer1: SignerEntry = {
  //   SignerEntry: {
  //     Account: WALLET_2.address,
  //     SignerWeight: 1,
  //   },
  // }
  // const signer2: SignerEntry = {
  //   SignerEntry: {
  //     Account: WALLET_3.address,
  //     SignerWeight: 1,
  //   },
  // }

  // Define WALLET_2 and WALLET_3 as signers for WALLET_1
  // await setSignerList(
  //   {
  //     SignerQuorum: 2,
  //     SignerEntries: [signer1, signer2],
  //   },
  //   { wallet: WALLET_1, isMultisign: false },
  // )

  /**
   * Multi sign payment example
   */

  // const payment: Payment = {
  //   Account: WALLET_1.address,
  //   Amount: xrpToDrops(1),
  //   Destination: "rnP5xouWVtZY3epvTp2FnaQhmUNzuaGC4t",
  //   TransactionType: "Payment",
  // }

  // const signature1 = (await sign(payment, { wallet: WALLET_2, isMultisign: true }, 2)).tx_blob
  // const signature2 = (await sign(payment, { wallet: WALLET_3, isMultisign: true }, 2)).tx_blob

  // await sendPayment({
  //   isMultisign: true,
  //   wallet: WALLET_1,
  //   signatures: [signature1, signature2],
  // })

  /**
   *  ____                                  _      ____ _                            _
   * |  _ \ __ _ _   _ _ __ ___   ___ _ __ | |_   / ___| |__   __ _ _ __  _ __   ___| |___
   * | |_) / _` | | | | '_ ` _ \ / _ \ '_ \| __| | |   | '_ \ / _` | '_ \| '_ \ / _ \ / __|
   * |  __/ (_| | |_| | | | | | |  __/ | | | |_  | |___| | | | (_| | | | | | | |  __/ \__ \
   * |_|   \__,_|\__, |_| |_| |_|\___|_| |_|\__|  \____|_| |_|\__,_|_| |_|_| |_|\___|_|___/
   */

  // await createPaymentChannel({
  //   txn: {
  //     Amount: "90",
  //     SettleDelay: 5,
  //     Destination: WALLET_2.address,
  //     PublicKey: WALLET_1.publicKey,
  //   },
  //   wallet: WALLET_1,
  // })

  /**
   *  __  ______ _   _    _    ___ _   _
   *  \ \/ / ___| | | |  / \  |_ _| \ | |
   *   \  / |   | |_| | / _ \  | ||  \| |
   *   /  \ |___|  _  |/ ___ \ | || |\  |
   *  /_/\_\____|_| |_/_/   \_\___|_| \_|
   */

  // const MAX_LEDGERS_WAITED = 10

  // const sidechainClient = new Client(networks.DEVNET_XRPL_SIDECHAIN)
  // await sidechainClient.connect()

  // // Step 1 - Get locking account objects
  // const lockingAccountObjects = await client.request({
  //   account: LOCKING_CHAIN_DOOR_ACCOUNT_DEVNET,
  //   command: "account_objects",
  //   type: "bridge",
  // })
  // console.log("lockingAccountObjects", lockingAccountObjects)

  // const bridgeData = lockingAccountObjects.result.account_objects.filter(
  //   (obj) =>
  //     obj.LedgerEntryType === "Bridge" && obj.XChainBridge.LockingChainIssue.currency === "XRP",
  // )[0] as LedgerEntry.Bridge

  // const bridge: XChainBridge = bridgeData.XChainBridge

  // // Step 2 - Creating wallets
  // // console.log("Creating wallet on the locking chain via the faucet...")

  // // const { wallet: wallet1 } = await client.fundWallet()
  // // console.log("wallet1", wallet1)
  // // const wallet2 = Wallet.generate()
  // // console.log("wallet2", wallet2)

  // // // // Step 3 - Enabling wallet 2 via the bridge transfer
  // // const fundTx = await xChainAccountCreateCommit({
  // //   txn: {
  // //     XChainBridge: bridge,
  // //     SignatureReward: bridgeData.SignatureReward,
  // //     Destination: wallet2.classicAddress,
  // //     Amount: xrpToDrops(20),
  // //   },
  // //   wallet: wallet1,
  // //   client,
  // // })

  // // Step 4 - Wait on issuing chain to see balance updated

  // // function sleep(ms: number) {
  // //   return new Promise((resolve) => {
  // //     setTimeout(resolve, ms)
  // //   })
  // // }

  // // let ledgersWaited = 0
  // // let initialBalance = "0"
  // // while (ledgersWaited < 10) {
  // //   await sleep(4000)

  // //   try {
  // //     initialBalance = await sidechainClient.getXrpBalance(wallet2.classicAddress)
  // //     console.log(
  // //       `Wallet ${wallet2.classicAddress} has been funded with a balance of ${initialBalance} XRP`,
  // //     )
  // //     break
  // //   } catch (_error) {
  // //     ledgersWaited += 1
  // //     if (ledgersWaited === 10) {
  // //       // This error should never be hit if the bridge is running
  // //       throw Error("Destination account creation via the bridge failed.")
  // //     }
  // //   }
  // // }

  // const claimIdResult = await xChainCreateClaimId({
  //   txn: {
  //     XChainBridge: bridge,
  //     SignatureReward: bridgeData.SignatureReward,
  //     OtherChainSource: WALLET_1.classicAddress,
  //   },
  //   wallet: WALLET_2,
  //   client: sidechainClient,
  // })

  // const xchainClaimId = getXChainClaimID(claimIdResult?.result.meta)

  // if (xchainClaimId == null) {
  //   // This shouldn't trigger assuming the transaction succeeded
  //   throw Error("Could not extract XChainClaimID")
  // }

  // console.log(`Claim ID for the transfer: ${xchainClaimId}`)

  // console.log("Step 2: Locking the funds on the locking chain with an XChainCommit transaction...")

  // await xChainCommit({
  //   txn: {
  //     Amount: xrpToDrops(1.5),
  //     XChainBridge: bridge,
  //     XChainClaimID: xchainClaimId,
  //     OtherChainDestination: WALLET_2.classicAddress,
  //   },
  //   wallet: WALLET_1,
  //   client,
  // })

  // await sidechainClient.disconnect()

  /**
   *     _                             _       __  __      _   _               _
   *    / \   ___ ___ ___  _   _ _ __ | |_    |  \/  | ___| |_| |__   ___   __| |___
   *   / _ \ / __/ __/ _ \| | | | '_ \| __|   | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
   *  / ___ \ (_| (_| (_) | |_| | | | | |_    | |  | |  __/ |_| | | | (_) | (_| \__ \
   * /_/   \_\___\___\___/ \__,_|_| |_|\__|   |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
   */

  // await getAccountCurrencies({ account: WALLET_3.address, command: "account_currencies" })

  // await getAccountInfo({ methodRequest: { account: WALLET_1.address }, client })

  // await getAccountNfts({ account: WALLET_1.address, command: "account_nfts" })

  // await getAccountLines({ account: WALLET_2.address, command: "account_lines" })

  // await getAccountOffers({ account: WALLET_1.address, command: "account_offers" })

  // await getAccountObjects({ account: WALLET_3.address, command: "account_objects" })

  // await getAccountTx({ account: "", command: "account_tx" })

  // await getAccountChannels({ account: WALLET_1.address, command: "account_channels" })

  /**
   *     _    __  __ __  __        __  __      _   _               _
   *    / \  |  \/  |  \/  |      |  \/  | ___| |_| |__   ___   __| |___
   *   / _ \ | |\/| | |\/| |      | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
   *  / ___ \| |  | | |  | |      | |  | |  __/ |_| | | | (_) | (_| \__ \
   * /_/   \_\_|  |_|_|  |_|      |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
   */
  // await getAMMInfo({
  //   command: "amm_info",
  //   asset: { currency: "XRP" },
  //   asset2: { issuer: WALLET_1.address, currency: TOKEN },
  // })

  /**
   *  ____                             __  __      _   _               _
   * / ___|  ___ _ ____   _____ _ __  |  \/  | ___| |_| |__   ___   __| |___
   * \___ \ / _ \ '__\ \ / / _ \ '__| | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
   *  ___) |  __/ |   \ V /  __/ |    | |  | |  __/ |_| | | | (_) | (_| \__ \
   * |____/ \___|_|    \_/ \___|_|    |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
   */

  // await getServerState()

  /**
   *    ____ _ _         __  __      _   _               _
   *   / ___| (_) ___   |  \/  | ___| |_| |__   ___   __| |___
   *  | |   | | |/ _ \  | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
   *  | |___| | | (_) | | |  | |  __/ |_| | | | (_) | (_| \__ \
   *   \____|_|_|\___/  |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
   */
  // await getNftInfo({ nft_id: "" })

  // await getNftHistory({
  //   nft_id: "",
  // })

  /**
   *  ____              _               __  __
   * | __ )  ___   ___ | | __     ___  / _|/ _| ___ _ __ ___
   * |  _ \ / _ \ / _ \| |/ /    / _ \| |_| |_ / _ \ '__/ __|
   * | |_) | (_) | (_) |   <    | (_) |  _|  _|  __/ |  \__ \
   * |____/ \___/ \___/|_|\_\    \___/|_| |_|  \___|_|  |___/
   */

  // await getBookOffers({
  //   command: "book_offers",
  //   taker_gets: {
  //     currency: "XRP",
  //   },
  //   taker_pays: {
  //     currency: TOKEN,
  //     issuer: WALLET_1.address,
  //   },
  // })

  /**
   *   ___  _   _
   *  / _ \| |_| |__   ___ _ __ ___
   * | | | | __| '_ \ / _ \ '__/ __|
   * | |_| | |_| | | |  __/ |  \__ \
   *  \___/ \__|_| |_|\___|_|  |___/
   */

  // await showAccountBalanceChanges("r3rZHvLMGsGCcd51aG2QfdLZGWBSbxErvq", client)

  await showTxBalanceChanges(
    "8821A8EF3E1BC04B59FC2C4056EDC6C8440BF6E40B231D810936C159953A44E4",
    client,
  )

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
