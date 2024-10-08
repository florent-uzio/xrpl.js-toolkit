# xrpl.js demo

## Installation

1. Clone the project
2. Run `npm install`

## Usage

Create some wallets using the [faucets](https://xrpl.org/xrp-testnet-faucet.html).

The Testnet faucet is recommended except if you need to test functionalities in development. In that case you would choose the devnet or another specific network.

Then create a `.env` file with the same structure as the `.env.example` file at the root of this project and paste the seed/secrets that you would have gotten via the faucets.
You can also define a token (issued currency for your trustset or payment transactions).

```tsx
WALLET_1_SEED=s...
WALLET_2_SEED=s...
WALLET_3_SEED=s...

# Issued Token name
TOKEN=ABCD_TOKEN
```

**Important**: Make sure that no quotes are included for the key values in the `.env` file.

**Important 2**: Make sure that all the `WALLET_X_SEED` are defined with a seed value. If you need only two wallets, comment or remove `WALLET_3_SEED`.

**Wrong** ❌:

```
WALLET_1_SEED="s1234"
WALLET_2_SEED=
```

**Correct** ✅:

```
WALLET_1_SEED=s1234
WALLET_2_SEED=s9234
```

### Index.ts

Edit `./src/index.ts` to send transactions or execute your code.

There are two main functions that you can use: `submitTxnAndWait` and `submitMethod`.

### submitTxnAndWait

For example to send a payment:

```ts
import * as dotenv from "dotenv"
import { Client, xrpToDrops } from "xrpl"
import { networks } from "./networks"
import { submitTxnAndWait } from "./transactions"
import { WALLET_1, WALLET_2 } from "./wallets"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.testnet.ripple)

  // Do not comment
  await client.connect()

  // Write your code here...
  await submitTxnAndWait({
    txn: {
      Account: WALLET_1.address,
      TransactionType: "Payment",
      Destination: WALLET_2.address,
      Amount: xrpToDrops(1),
    },
    wallet: WALLET_1,
    client,
  })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
```

Run `npm start` in your terminal. The content of `index.ts` will be executed.

### submitMethod

For example to retrieve the account information:

```ts
import * as dotenv from "dotenv"
import { Client } from "xrpl"
import { submitMethod } from "./methods"
import { networks } from "./networks"
import { WALLET_1 } from "./wallets"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.testnet.ripple)

  // Do not comment
  await client.connect()

  // Write your code here...
  await submitMethod({
    request: {
      command: "account_info",
      account: WALLET_1.classicAddress,
    },
    client,
  })

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()
```

Run `npm start` in your terminal. The content of `index.ts` will be executed.
