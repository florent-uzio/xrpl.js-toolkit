import { Client, multisign } from "xrpl"

/**
 * Helper to concatenate the signatures for a multisign transaction and submit the concatenation to the XRPL.
 *
 * @param {string[]} signatures All the signatures gathered for the multisign transaction.
 */
export const multiSignAndSubmit = async (signatures: string[], client: Client) => {
  const multiSignatures = multisign(signatures)

  const response = await client.submitAndWait(multiSignatures)

  console.log(response)
}
