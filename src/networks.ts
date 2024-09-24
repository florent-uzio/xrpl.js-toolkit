// https://xrpl.org/public-servers.html
export const networks = {
  mainnet: {
    rippleS1: "wss://s1.ripple.com",
    rippleS2: "wss://s2.ripple.com",
    xrplFoundation: "wss://xrplcluster.com",
  },
  testnet: {
    ripple: "wss://s.altnet.rippletest.net:51233",
    xrplLabs: "wss://testnet.xrpl-labs.com",
    rippleClio: "wss://clio.altnet.rippletest.net:51233",
    xahau: "wss://xahau-test.net",
  },
  devnet: {
    ripple: "wss://s.devnet.rippletest.net:51233",
    rippleClio: "wss://clio.devnet.rippletest.net:51233",
    sidechain: "wss://sidechain-net2.devnet.rippletest.net:51233",
  },
} as const
