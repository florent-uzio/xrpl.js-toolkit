import { Client } from "xrpl"

// https://xrpl.org/public-servers.html
const networks = {
  RIPPLE_MAINNET: "wss://s2.ripple.com", // Points to clio server
  RIPPLE_TESTNET: "wss://s.altnet.rippletest.net:51233", // Points to clio server
  RIPPLE_DEVNET: "wss://s.devnet.rippletest.net:51233", // Points to clio server
  XRPL_LABS_TESTNET: "wss://testnet.xrpl-labs.com",
  RIPPLE_AMM_DEVNET: "wss://amm.devnet.rippletest.net:51233/",
  XRPL_MAINNET: "wss://xrplcluster.com/", // XRP Ledger Foundation
}

let xrplClient: Client

// Initialize the client if it doesn't exist or return it.
export const getXrplClient = () => {
  if (!xrplClient) {
    xrplClient = new Client(networks.RIPPLE_TESTNET)
  }

  return xrplClient
}
