# xrpl.js demo

## Installation

1. Clone the project
2. Run `npm install`

## Usage

Create two wallets using the [faucets](https://xrpl.org/xrp-testnet-faucet.html).

The Testnet faucet is recommended except if you need to test functionalities in development. In that case you would choose the devnet or another specific network.

Then edit `./src/wallets.ts` and add the seed/secrets that you would have gotten via the faucets.

```tsx
const MINT_WALLET_SEED = "place your seed here"
const BUYER_WALLET_SEED = "place your seed here"
```

Then edit `./src/index.ts` by (un)commenting the different functions in the file.

You can pass different arguments to the available functions.

Then run `npm run start` in your terminal. The content of `index.ts` will be executed.

### Available functions

- sendPayment
- nftMint
- nftCreateOffer
- nftAcceptOffer
- nftCancelOffer
