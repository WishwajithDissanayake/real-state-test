import { getChainNetworkByChainId } from '../../Blockchain/utils/chainList'
import { ethers, utils } from 'ethers'
import { configs } from '../web3.config'

export const getWeb3PRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.JsonRpcProvider(web3configs.rpcUrls[0])
  return web3
}

export const getWeb3ViaWebsocketPRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.WebSocketProvider(process.env.REACT_APP_RPC_WEB_SOCKET_URL, {
    name: web3configs.chainName, chainId: parseInt(web3configs.chainId, 16)
  })
  return web3
}


export const getBNBPrice = async () => {
  let bnbPrice = 0.0
  try {
    const provider = getWeb3PRovider()
    const pcsRouterABI = JSON.parse(configs.pancakeSwap.pcsRouterABI)
    const pcsRouterAddress = configs.pancakeSwap.routerAddress
    const pcsRouterContractInstance = new ethers.Contract(pcsRouterAddress, pcsRouterABI, provider)

    const bnbToSell = utils.parseEther("1")
    const wBNBAddress = process.env.REACT_APP_WBNB_ADDRESS
    const usdtAddress = process.env.REACT_APP_USDT_ADDRESS

    const BNBPriceResponse = await pcsRouterContractInstance.getAmountsOut(bnbToSell, [wBNBAddress, usdtAddress])
    const bnbPriceFormatted = utils.formatEther(BNBPriceResponse[1])
    bnbPrice = bnbPriceFormatted.toString()
    return bnbPrice
  } catch (error) {
    console.log("ERROR while calculating BNB Price : ", error)
    return bnbPrice
  }
}

export const getTokenPriceInUSDByTokenAddress = async (tokenAddress) => {
  let tokenPrice = 0.0
  try {
    const provider = getWeb3PRovider()
    if (tokenAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const contractInstance = new ethers.Contract(tokenAddress, eRC20ContractABI, provider)
      const tokenDecimalString = await contractInstance.decimals()
      const tokenDecimals = parseInt(tokenDecimalString)

      const tokensToSell = utils.parseUnits("1", tokenDecimals)

      //create pcs router instance 
      const pcsRouterABI = JSON.parse(configs.pancakeSwap.pcsRouterABI)
      const pcsRouterAddress = configs.pancakeSwap.routerAddress
      const pcsRouterContractInstance = new ethers.Contract(pcsRouterAddress, pcsRouterABI, provider)

      const wBNBAddress = process.env.REACT_APP_WBNB_ADDRESS
      const priceOfTokenResponse = await pcsRouterContractInstance.getAmountsOut(tokensToSell, [tokenAddress, wBNBAddress])
      const formattedTokenPrice = utils.formatEther(priceOfTokenResponse[1])
      const tokenPriceInBNB = formattedTokenPrice.toString()
      const bnbPrice = await getBNBPrice()
      tokenPrice = parseFloat(tokenPriceInBNB) * parseFloat(bnbPrice)
      return tokenPrice
    } else {
      return tokenPrice
    }
  } catch (error) {
    console.info("ERROR while fetching token price : ", error)
    return tokenPrice
  }
}

export const getERC20TokenDataByTokenAddress = async (tokenAddress) => {
  let tokenName = ''
  let tokenSymbol = ''
  let tokenDecimals = ''
  let tokenTotalSupply = ''

  try {
    const provider = getWeb3PRovider()
    if (tokenAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const contractInstance = new ethers.Contract(tokenAddress, eRC20ContractABI, provider)

      tokenName = await contractInstance.name()
      tokenSymbol = await contractInstance.symbol()
      const totalSupply = await contractInstance.totalSupply()

      const hexToDecimal = hex => parseInt(hex, 10)
      tokenTotalSupply = hexToDecimal(totalSupply)

      const tokenDecimalString = await contractInstance.decimals()
      tokenDecimals = parseInt(tokenDecimalString)

      return {
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenTotalSupply
      }
    } else {
      return {
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenTotalSupply
      }
    }
  } catch (error) {
    const errorMessage = { code: 1001, message: "Invalid token details" }
    throw errorMessage
  }
}

export const getERC20TokenDecimalsByTokenAddress = async (tokenAddress) => {
  let tokenDecimals = 0
  try {
    const provider = getWeb3PRovider()
    if (tokenAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const contractInstance = new ethers.Contract(tokenAddress, eRC20ContractABI, provider)
      const tokenDecimalString = await contractInstance.decimals()
      tokenDecimals = parseInt(tokenDecimalString)
      return tokenDecimals
    } else {
      return tokenDecimals
    }
  } catch (error) {
    const errorMessage = { code: 1001, message: "Error while fetching token decimals amount" }
    throw errorMessage
  }
}


export const getERC20TokenBalanceByWalletAddress = async (tokenAddress, walletAddress) => {
  let userTokenBalance = 0
  try {
    const provider = getWeb3PRovider()
    if (tokenAddress && walletAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const contractInstance = new ethers.Contract(tokenAddress, eRC20ContractABI, provider)

      const tokenDecimals = await getERC20TokenDecimalsByTokenAddress(tokenAddress)
      const tokenBalanceResponse = await contractInstance.balanceOf(walletAddress)
      const tokenBalanceUnformatted = tokenBalanceResponse.toString()
      userTokenBalance = utils.formatUnits(tokenBalanceUnformatted, tokenDecimals)
      return userTokenBalance
    } else {
      return userTokenBalance
    }
  } catch (error) {
    const errorMessage = { code: 1001, message: "Error while fetching user token balance" }
    throw errorMessage
  }
}


export const getLPTokenDetailsByPairAddress = async (pairAddress) => {
  let tokenOneName = null
  let tokenTwoName = null
  let tokenOneSymbol = null
  let tokenTwoSymbol = null
  let tokenOneAddress = null
  let tokenTwoAddress = null
  let dexPlatformName = null

  try {
    const provider = getWeb3PRovider()
    if (pairAddress) {

      const quoteTokenList = configs.possiblePairAddress
      const lpTokenContractABI = JSON.parse(configs.pancakeSwap.lpTokenAbi)
      const lpTokenContractInstance = new ethers.Contract(pairAddress, lpTokenContractABI, provider)

      let quoteTokenAddress = null
      let actualToken = null
      //get the token one and two address
      tokenOneAddress = await lpTokenContractInstance.token0()
      tokenTwoAddress = await lpTokenContractInstance.token1()

      quoteTokenAddress = quoteTokenList.find(token => {
        return token.toLocaleLowerCase() === tokenOneAddress.toLocaleLowerCase()
      })

      if (!quoteTokenAddress) {
        actualToken = tokenOneAddress
        quoteTokenAddress = quoteTokenList.find(token => {
          return token.toLocaleLowerCase() === tokenTwoAddress.toLocaleLowerCase()
        })
      } else {
        actualToken = tokenTwoAddress
      }

      console.log("Token Address Actual ", actualToken)
      //get the pair token symbol
      const pairTokenSymbol = await lpTokenContractInstance.symbol()

      if (pairTokenSymbol === "Cake-LP") {
        dexPlatformName = "PancakeSwap - PCS"
      } else {
        dexPlatformName = "Unknown"
      }


      const eRC20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const contractInstanceForTokenOne = new ethers.Contract(tokenOneAddress, eRC20ContractABI, provider)
      const contractInstanceForTokenTwo = new ethers.Contract(tokenTwoAddress, eRC20ContractABI, provider)

      tokenOneName = await contractInstanceForTokenOne.name()
      tokenOneSymbol = await contractInstanceForTokenOne.symbol()

      tokenTwoName = await contractInstanceForTokenTwo.name()
      tokenTwoSymbol = await contractInstanceForTokenTwo.symbol()

      return {
        tokenOneName,
        tokenTwoName,
        tokenOneSymbol,
        tokenTwoSymbol,
        tokenOneAddress,
        tokenTwoAddress,
        dexPlatformName,
      }
    } else {
      return {
        tokenOneName,
        tokenTwoName,
        tokenOneSymbol,
        tokenTwoSymbol,
        tokenOneAddress,
        tokenTwoAddress,
        dexPlatformName,
      }
    }
  } catch (error) {
    console.log("ERROR while fetching LP token data ", error)
    return {
      tokenOneName,
      tokenTwoName,
      tokenOneSymbol,
      tokenTwoSymbol,
      tokenOneAddress,
      tokenTwoAddress,
      dexPlatformName,
    }
  }
}

export const decimalAdjust = (type, value, exp) => {
  type = String(type);
  if (!["round", "floor", "ceil"].includes(type)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'."
    );
  }
  exp = Number(exp);
  value = Number(value);
  if (exp % 1 !== 0 || Number.isNaN(value)) {
    return NaN;
  } else if (exp === 0) {
    return Math[type](value);
  }
  const [magnitude, exponent = 0] = value.toString().split("e");
  const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
  return Number(`${newMagnitude}e${+newExponent + exp}`);
}

export const floor10 = (value, exp) => decimalAdjust("floor", value, exp);