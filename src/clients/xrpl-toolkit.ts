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
    // Connect to the XRPL client if not already connected
    if (!this.client.isConnected()) {
      await this.client.connect()
    }

    if (!run) {
      if (!props.showLogs) {
        console.log("Transaction submission skipped as 'run' is set to false")
      }
      await this.client.disconnect()
      return
    }

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

      if (this.client.isConnected()) {
        await this.client.disconnect()
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
      await this.client.disconnect()
      return
    }

    if (!this.client.isConnected) {
      await this.client.connect()
    }

    // Update the currency in case it has more than 3 characters
    const updatedRequest: T = deepReplace(request, "currency", (key, value) => {
      return { [key]: convertCurrencyCodeToHex(value) }
    })

    const response = await this.client.request(updatedRequest)

    // Update fields in the console.log only
    let updatedResponse = deepReplace(response, "send_currencies", this.hexToStringCurrency)
    updatedResponse = deepReplace(updatedResponse, "receive_currencies", this.hexToStringCurrency)
    updatedResponse = deepReplace(updatedResponse, "currency", this.hexToStringCurrency)

    if (showLogs) {
      console.log(JSON.stringify(updatedResponse, undefined, 2))
    }

    await this.client.disconnect()

    if (this.client.isConnected()) {
      await this.client.disconnect()
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

  getClient(): Client {
    return this.client
  }

  getNetwork(): string {
    return this.network
  }

  connect(): Promise<void> {
    return this.client.connect()
  }

  disconnect(): Promise<void> {
    return this.client.disconnect()
  }
}
