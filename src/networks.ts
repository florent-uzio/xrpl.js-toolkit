// https://xrpl.org/public-servers.html
export const networks = {
  RIPPLE_MAINNET: "wss://s2.ripple.com", // Points to clio server
  RIPPLE_TESTNET: "wss://s.altnet.rippletest.net:51233", // Points to clio server
  RIPPLE_DEVNET: "wss://s.devnet.rippletest.net:51233", // Points to clio server
  XRPL_LABS_TESTNET: "wss://testnet.xrpl-labs.com",
  RIPPLE_AMM_DEVNET: "wss://amm.devnet.rippletest.net:51233/",
  XRPL_MAINNET: "wss://xrplcluster.com/", // XRP Ledger Foundation
  DEVNET_XRPL_SIDECHAIN: "wss://sidechain-net2.devnet.rippletest.net:51233",
} as const
