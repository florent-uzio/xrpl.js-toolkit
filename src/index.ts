import * as dotenv from "dotenv"
import { Client, Wallet } from "xrpl"
import { submitMethod } from "./methods"
import { networks } from "./networks"
import { submitTxnAndWait } from "./transactions"
import { WALLET_1 } from "./wallets"

dotenv.config()

// Issued Currency that you want to use in your TrustSet or Payment transactions for example.
// Create a TOKEN field in your .env file. If TOKEN is not present, it will default to "TEST_TOKEN".
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  const client = new Client(networks.testnet.rippleClio)

  // Do not comment
  await client.connect()

  const txs = await submitMethod({
    request: {
      command: "account_tx",
      account: WALLET_1.address,
      // limit: 1,
      // asset: {
      //   currency: "XRP",
      // },
      // asset2: {
      //   currency: "4D41474100000000000000000000000000000000", // convertCurrencyCodeToHex("MAGA"),
      //   issuer: "rBnb2xdPHBF6qnR4ErcZPLinWno5RzQUiB",
      // },
      // amm_account: "r9YBh7DEJBGyoNBfT8yNVJTdRRjtv1myAt",
    },
    client,
  })

  const filtered = txs.result.transactions.map((tx) => {
    return {
      hash: tx.hash,
      // @ts-expect-error
      type: tx.tx_json.TransactionType,
    }
  })

  console.log(filtered)

  // Do not comment, disconnect the client
  await client.disconnect()
}

// Will run the main function above. Do not comment.
main()

const wallets: Wallet[] = []
const ONE_TRILLION = "1000000000000"

const config = async (client: Client) => {
  for (let i = 0; i < 10; i++) {
    const wallet = await client.fundWallet()
    wallets.push(wallet.wallet)

    console.log(`Funded ${i}: ${JSON.stringify(wallet.wallet, null, 2)}`)

    await submitTxnAndWait({
      txn: {
        TransactionType: "TrustSet",
        Account: wallet.wallet.address,
        LimitAmount: {
          currency: TOKEN,
          value: ONE_TRILLION,
          issuer: WALLET_1.address,
        },
      },
      client,
      wallet: wallet.wallet,
    })

    await submitTxnAndWait({
      txn: {
        TransactionType: "Payment",
        Account: WALLET_1.address,
        Destination: wallet.wallet.address,
        Amount: {
          currency: TOKEN,
          value: "1000",
          issuer: WALLET_1.address,
        },
      },
      client,
      wallet: WALLET_1,
    })
  }

  console.log(wallets)
}

const allWallets = [
  {
    publicKey: "ED22264CCDA430DCB9A9EBF0E52F5409728B897A01D413F3C70B93923FBBF57948",
    privateKey: "EDAE9B9A3A5B15CAE038D2F01FA25E1D9D3B2569C9A06C3347ED848F9109ACA853",
    classicAddress: "rfVJZXHAsE4obd3NUjKU6EiPygt74EYAeh",
    seed: "sEd7eGayZ1GShNex4zVJYqyVAQ4Fmcc",
  },
  {
    publicKey: "EDCB1B98D5293E6FA6CA713215BBF047A64BAC9BAA575013DDDF2CFC8701624B88",
    privateKey: "ED79A2ED34E22A7BC71D704EF81710152130413F83339D403A8DA515E437E3FFC5",
    classicAddress: "rfBVCok7R39Bsu6tTUf5RR9SNz1qtTxYwR",
    seed: "sEdTieqrsnXAobuuURbEhoKpc3RktFH",
  },
  {
    publicKey: "ED04A6C6ACEA8E292CCA5CD108E82E1FE9DBD3FFADCF8E8AC0E517D0E2FE3191B9",
    privateKey: "ED5B97115F8F764992A922B3639E9681709B3E379C57F0B1E7756394B1F410BB1F",
    classicAddress: "raLQzUs7fEX3EprVe5PiPLutX7is9pamWQ",
    seed: "sEdT9emREJABQDSa6rAZpxqwosTvP7J",
  },
  {
    publicKey: "ED965664B28386E9ED56560BB5B9001F08DEA36635D5A9533B2B1D29C8C0806D22",
    privateKey: "ED01B91F99C96B1946CD5561CDC9B3AA6F7A07246F62B3CC4C435CC56BFD675A17",
    classicAddress: "rsgVoLzBR2TTQJzdq8EWQbpzEYVGR4ANDj",
    seed: "sEdSKBFEKT7H52yHv8qrJjX6MbtvLrq",
  },
  {
    publicKey: "EDA25E90DC28ABC2EF5BEE9EBDFBC9B28E32B8A7E5C1CE80D071E85C56A3F6F500",
    privateKey: "ED49B1CE46DF68A76B12128439C8735D6A873DA07588F4715F81F3FF176148A6B2",
    classicAddress: "rGvjRo4LCzNMyAa8CDNBrxVDEFV1Zz94Db",
    seed: "sEdSeW4fw7C7pgtmPiSEdjjcbZpTmix",
  },
  {
    publicKey: "EDE4BE45EE2FB3817E684C0B0225EA3574B8A663CA3746DA96AB3B0E1C216ECD14",
    privateKey: "EDFAC2BEC586A4C4354B3DBB4F86DB9B03B87D29C5B9098AC71EA7E9AACD9ED3B1",
    classicAddress: "rKtW77UwS8opvVHhbcnr6vu1Co8scoE6vQ",
    seed: "sEdSR2WTFfRGtKFTdXMdrxPJg5PnfaS",
  },
  {
    publicKey: "ED749D8475390D78AA0667D99BDD1028C9296E92DD215D2A8984403203E6497B87",
    privateKey: "EDD177E3B42E5F65FBC3D0312174AE79FFB9E051550C28D4442BD0513D4EAEA305",
    classicAddress: "rnKsmsD2NUF3DiAxohzKwrihUFWUQC2uMp",
    seed: "sEdTwhJNqrz4Fh8Sfq4N2f2nBABahrt",
  },
  {
    publicKey: "EDA2C84B3FA5B7F2316BF46B2B2068B811F0842FD5C670B81C8DA39FAB5488A675",
    privateKey: "ED2F8BD7DD9A431F5E6EC89E2560A13F3B32621AE7DDD3A2C3F91786C0338A1B85",
    classicAddress: "rUCrSyKbU7XvuMGSew1zGvyhyCmAK7z8Xj",
    seed: "sEd7pLNNPS8C4QCdWShknyg7Qjq1ybb",
  },
  {
    publicKey: "ED0461AAC1C80278EAB10763F2C0E70C2413C941DA66C615B2E692E9CE571BA08A",
    privateKey: "ED02161A3A6C010417870ABCA26352F3C364B91EEBF5726702B814CEEE4BDE8169",
    classicAddress: "rfgZQztuocJgVuJEW7fMm5ZYn3HBCLr2JQ",
    seed: "sEdSZ7LQcigsFS2wQg3w5YjGYszrVnD",
  },
  {
    publicKey: "EDA20582A80851E1F414E531ABB5D29DDABE658A46365E4A8E880F661D2524699D",
    privateKey: "ED98249B0F44CC792DEABDB639C808368075110C6C37C51C24385F591B740227BC",
    classicAddress: "rJQMbTFCLRrbcS4fASZYPB8EcNVtAqBRnx",
    seed: "sEdSg9BXye3hyBJKGLbLoGXQk7RfU95",
  },
]
