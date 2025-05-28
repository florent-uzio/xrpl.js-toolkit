import * as dotenv from "dotenv"
import { Client, multisign, Payment } from "xrpl"
import { hashSignedTx } from "xrpl/dist/npm/utils/hashes"
import { networks } from "./networks"
import { submitTxnAndWait } from "./transactions"

dotenv.config()

// Issued Currency for TrustSet or Payment transactions.
// Set TOKEN in your .env file, defaults to "TEST_TOKEN" if not present.
const TOKEN = process.env.TOKEN ?? "TEST_TOKEN"

const main = async () => {
  // Connect to the XRPL Devnet
  const client = new Client(networks.devnet.ripple)
  await client.connect()
  console.log("Connected to XRPL Devnet.")

  // Fund issuer and three signer wallets
  const [issuer, signer1, signer2, signer3] = await Promise.all([
    client.fundWallet(null, { amount: "10" }),
    client.fundWallet(null, { amount: "10" }),
    client.fundWallet(null, { amount: "10" }),
    client.fundWallet(null, { amount: "10" }),
  ])
  console.log("Wallets funded:", {
    issuer: issuer.wallet.address,
    signer1: signer1.wallet.address,
    signer2: signer2.wallet.address,
    signer3: signer3.wallet.address,
  })
  console.log("")

  // Set up multisign with a SignerListSet transaction
  const signerListSetResponse = await submitTxnAndWait({
    txn: {
      Account: issuer.wallet.address,
      TransactionType: "SignerListSet",
      SignerQuorum: 2,
      SignerEntries: [
        { SignerEntry: { Account: signer1.wallet.address, SignerWeight: 1 } },
        { SignerEntry: { Account: signer2.wallet.address, SignerWeight: 1 } },
        { SignerEntry: { Account: signer3.wallet.address, SignerWeight: 1 } },
      ],
    },
    client,
    wallet: issuer.wallet,
    showLogs: false,
  })
  console.log("#️⃣  SignerListSet transaction hash:", signerListSetResponse.result.hash)

  // Prepare a Payment transaction
  const payment: Payment = {
    Account: issuer.wallet.address,
    TransactionType: "Payment",
    Amount: "100",
    Destination: signer1.wallet.address,
  }
  const preparedPayment = await client.autofill(payment, 3)
  console.log("Prepared Payment transaction:", preparedPayment)
  console.log("")

  // Each signer signs the prepared payment
  const signed1 = signer1.wallet.sign(preparedPayment, true)
  const signed2 = signer2.wallet.sign(preparedPayment, true)
  const signed3 = signer3.wallet.sign(preparedPayment, true)
  console.log("Signed Payment 1 (signer1):", signed1)
  console.log("Signed Payment 2 (signer2):", signed2)
  console.log("Signed Payment 3 (signer3):", signed3)
  console.log("")

  // Combine signatures into a multisigned transaction
  const multiSigned = multisign([signed1.tx_blob, signed2.tx_blob, signed3.tx_blob])
  console.log("🤖 Multi-signed Payment transaction blob:", multiSigned)
  console.log("")

  // Calculate transaction hash
  const hash_before_submission = hashSignedTx(multiSigned)
  console.log("#️⃣  Multi-signed transaction hash:", hash_before_submission)
  console.log("")

  // Submit the multisigned transaction and wait for validation
  const response = await client.submitAndWait(multiSigned)
  console.log("Transaction submission response:", response)

  console.log("")
  console.log({
    hash_before_submission,
    hash_after_submission: response.result.hash,
  })

  // Disconnect from the XRPL client
  await client.disconnect()

  console.log("")
  console.log("Disconnected from XRPL Devnet.")
}

// Run the main function
main()
