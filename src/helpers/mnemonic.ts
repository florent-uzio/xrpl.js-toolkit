import { BIP32Factory } from "bip32"
import { mnemonicToSeed } from "bip39"
import { ec as ECC } from "elliptic"
import { encodeSeed } from "xrpl"

const ecc = new ECC("secp256k1")
// @ts-expect-error
const bip32 = BIP32Factory(ecc)

export async function deriveXRPSeedFromMnemonic(mnemonic: string) {
  // Step 1: Convert mnemonic to seed
  const seedBuffer = await mnemonicToSeed(mnemonic)

  // Step 2: Derive the HD wallet from the seed
  const hdWallet = bip32.fromSeed(seedBuffer)

  // For the XRP Ledger, BIP-44 path is m/44'/144'/0'/0/0 for the first account
  const xrpPath = "m/44'/144'/0'/0/0"
  const xrpWallet = hdWallet.derivePath(xrpPath)
  if (!xrpWallet.privateKey) return

  // Step 3: Convert the HD private key to XRPL format seed
  const xrplSeed = encodeSeed(xrpWallet.privateKey, "secp256k1")

  return xrplSeed
}
