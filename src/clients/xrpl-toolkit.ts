import { Client, Request, RequestResponseMap, SubmittableTransaction, TxResponse } from "xrpl"
import {
  convertCurrencyCodeToHex,
  convertHexCurrencyCodeToString,
  deepReplace,
  multiSignAndSubmit,
  ReplacementFn,
} from "../helpers"
import { MethodProps, SubmitTxnAndWaitProps } from "../models"

export class XRPLToolkit {
  private readonly network: string
  private readonly client: Client

  constructor(network: string) {
    this.network = network
    this.client = new Client(network)
  }

  // Overloaded method signatures
  async submitTxnAndWait<T extends SubmittableTransaction>(
    props: SubmitTxnAndWaitProps<T> & { run: false },
  ): Promise<undefined>

  async submitTxnAndWait<T extends SubmittableTransaction>(
    props: SubmitTxnAndWaitProps<T> & { run?: true },
  ): Promise<TxResponse<T>>

  // Implementation
  async submitTxnAndWait<T extends SubmittableTransaction>({
    run = true,
    ...props
  }: SubmitTxnAndWaitProps<T>): Promise<TxResponse<T> | undefined> {
    if (!run) {
      if (!props.showLogs) {
        console.log("Transaction submission skipped as 'run' is set to false")
      }
      return
    }

    // Ensure the client is connected
    await this.connect()

    if (props.isMultisign) {
      await multiSignAndSubmit(props.signatures, this.client)
    } else {
      const { wallet, txn, showLogs = true } = props

      if (showLogs) {
        console.log(`Submitting: ${txn.TransactionType}`)
        console.log()
      }

      // Make sure the originating transaction address is the same as the wallet public address
      if (txn.Account !== wallet.address) {
        throw new Error("Field 'Account' must have the same address as the Wallet")
      }

      // Update the currency in case it has more than 3 characters
      const updatedTxn = deepReplace(txn, "currency", (key, value) => {
        return { [key]: convertCurrencyCodeToHex(value) }
      })

      // Submit to the XRPL and wait for the response
      const response = await this.client.submitAndWait(updatedTxn, { autofill: true, wallet })

      if (showLogs) {
        console.log(JSON.stringify(response, null, 2))
      }

      return response
    }
  }
  // New submitMethod integration
  async submitMethod<T extends Request>(props: MethodProps<T> & { run: false }): Promise<undefined>
  async submitMethod<T extends Request>(
    props: MethodProps<T> & { run?: true },
  ): Promise<RequestResponseMap<T, 2>>
  async submitMethod<T extends Request>({
    request,
    showLogs = true,
    run = true,
  }: MethodProps<T>): Promise<RequestResponseMap<T, 2> | undefined> {
    if (!run) {
      if (!showLogs) {
        console.log("Request submission skipped as 'run' is set to false")
      }
      return
    }

    // Ensure the client is connected
    await this.connect()

    // Update the currency in case it has more than 3 characters
    const updatedRequest: T = deepReplace(request, "currency", (key, value) => {
      return { [key]: convertCurrencyCodeToHex(value) }
    })

    const response = await this.client.request(updatedRequest)

    // Update fields in console.log only
    if (showLogs) {
      let updatedResponse = deepReplace(response, "send_currencies", this.hexToStringCurrency)
      updatedResponse = deepReplace(updatedResponse, "receive_currencies", this.hexToStringCurrency)
      updatedResponse = deepReplace(updatedResponse, "currency", this.hexToStringCurrency)

      console.log(JSON.stringify(updatedResponse, undefined, 2))
    }

    return response
  }

  // Private helper method for currency conversion
  private hexToStringCurrency: ReplacementFn = (key, value) => {
    if (Array.isArray(value)) {
      const newValues = value.map((val) => convertHexCurrencyCodeToString(val))
      return { [key]: newValues }
    }
    return { [key]: convertHexCurrencyCodeToString(value) }
  }

  /**
   * Get the XRPL client instance
   * @returns The XRPL client instance
   */
  getClient(): Client {
    return this.client
  }

  /**
   * Get the network of the XRPL client
   * @returns The network of the XRPL client
   * @example "wss://s.altnet.rippletest.net:51233"
   */
  getNetwork(): string {
    return this.network
  }

  async connect() {
    if (!this.client.isConnected()) {
      try {
        await this.client.connect()
      } catch (error) {
        console.error("Failed to connect to XRPL:", error)
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isConnected()) {
      try {
        await this.client.disconnect()
      } catch (error) {
        console.error("Error while disconnecting from XRPL:", error)
      }
    }
  }
}
