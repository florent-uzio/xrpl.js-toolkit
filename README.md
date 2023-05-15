# xrpl.js demo

## Installation

1. Clone the project
2. Run `npm install`

## Usage

Create two wallets using the [faucets](https://xrpl.org/xrp-testnet-faucet.html).

The Testnet faucet is recommended except if you need to test functionalities in development. In that case you would choose the devnet or another specific network.

Then create a `.env` file with the same structure as the `.env.example` file at the root of this project and paste the seed/secrets that you would have gotten via the faucets.
You can also define a token (issued currency for your trustset or payment transactions).

```tsx
WALLET_1_SEED=s...
WALLET_2_SEED=s...

# Issued Token name
TOKEN=ABCD_TOKEN
```

**Important**: Make sure that no quotes are included for the key values in the `.env` file.

**Wrong**:
WALLET_1_SEED="s1234"

**Correct**:
WALLET_1_SEED=s1234

Edit `./src/index.ts` by (un)commenting the different functions in the file.

You can pass different arguments to the available functions.

Run `npm run start` in your terminal. The content of `index.ts` will be executed.
