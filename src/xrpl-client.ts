import * as xrpl from "xrpl"

// https://xrpl.org/public-servers.html
const RIPPLE_TESTNET = "wss://s.altnet.rippletest.net:51233/"
// const XRPL_LABS_TESTNET = 'wss://testnet.xrpl-labs.com/'

export const xrplClient = new xrpl.Client(RIPPLE_TESTNET)
