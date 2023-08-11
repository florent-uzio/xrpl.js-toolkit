import { Client } from "xrpl"

// https://xrpl.org/public-servers.html
const networks = {
  RIPPLE_MAINNET: "wss://s2.ripple.com", // Also Clio server
  RIPPLE_TESTNET: "wss://s.altnet.rippletest.net:51233",
  XRPL_LABS_TESTNET: "wss://testnet.xrpl-labs.com",
  RIPPLE_AMM_DEVNET: "wss://amm.devnet.rippletest.net:51233/",
  RIPPLE_CLIO: "wss://s2-clio.ripple.com",
  RIPPLE_CLIO_TESTNET: "wss://clio.altnet.rippletest.net",
  RIPPLE_CLIO_DEVNET: "wss://clio.devnet.rippletest.net",
  XRPL_MAINNET: "wss://xrplcluster.com/",
}

let xrplClient: Client

// Initialize the client if it doesn't exist or return it.
export const getXrplClient = () => {
  if (!xrplClient) {
    xrplClient = new Client(networks.RIPPLE_CLIO_TESTNET)
  }

  return xrplClient
}
