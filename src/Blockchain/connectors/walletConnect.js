
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
const POLLING_INTERVAL = 3000

const wcConnector = new WalletConnectConnector({
  rpc: {
    56: "https://bsc-dataseed1.binance.org"
  },
  chainId: 56,
  network: "binance",
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: [
      "metamask",
      "trust"
    ]
  },
  pollingInterval: POLLING_INTERVAL
})

wcConnector.networkId = 56

export { wcConnector }