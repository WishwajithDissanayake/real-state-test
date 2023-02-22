export const networks = [
  {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "BSC Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  },
  {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "tBNB",
      decimals: 18
    },
    rpcUrls: [
      "https://data-seed-prebsc-2-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545"
    ],
    blockExplorerUrls: ["https://testnet.binance.org/"]
  }
];

export const getChainNetworkByChainId = (chainId) => {
  return networks.find(data => data.chainId === `0x${Number(chainId).toString(16)}`)
}