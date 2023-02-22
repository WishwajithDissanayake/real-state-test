import { getChainNetworkByChainId } from '../Blockchain/utils/chainList'
import { ethers } from 'ethers'
import { configs } from './web3.config'

export const getWeb3PRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.JsonRpcProvider(web3configs.rpcUrls[0])
  return web3
}

export const getWebsocketProvider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.WebSocketProvider(process.env.REACT_APP_RPC_WEB_SOCKET_URL, {
    name: web3configs.chainName, chainId: parseInt(web3configs.chainId, 16)
  })
  return web3
}

export const getTokenApprovalData = async (tokenAddress, accountAddress) => {
  let tokenName = ''
  let tokenSymbol = ''
  let tokenDecimals = ''
  let tokenTotalSupply = 0
  let tokenCirculationSupply = 0
  try {
    const provider = getWeb3PRovider()
    if (tokenAddress && accountAddress) {
      const eRC20ContractABI = JSON.parse(configs.commonContractABIS.bsc.commonERC20ContractABI)
      const contractInstance = new ethers.Contract(tokenAddress, eRC20ContractABI, provider)
      const balanceOfAddress = await contractInstance.balanceOf(accountAddress)
      const balanceInInt = parseInt(balanceOfAddress.toString())

      if (balanceInInt <= 0) {
        return {
          errors: {
            isErrors: true,
            errorMessage: 'You don\'t have enough token balance to proceed'
          },
          tokenData: {
            tokenAddress,
            tokenName,
            tokenSymbol,
            tokenDecimals,
            tokenTotalSupply,
            tokenCirculationSupply
          }
        }
      } else {

        //fetch the token data
        const _tokenName = await contractInstance.name()
        tokenName = _tokenName.toString()
        const _tokenSymbol = await contractInstance.symbol()
        tokenSymbol = _tokenSymbol.toString()
        const _tokenDecimals = await contractInstance.decimals()
        tokenDecimals = parseInt(_tokenDecimals.toString())
        const _tokenTotalSupply = await contractInstance.totalSupply()
        const totalSupplyInInt = parseInt(_tokenTotalSupply.toString())
        tokenTotalSupply = totalSupplyInInt / (10 ** tokenDecimals)

        //get the circulation supply
        tokenCirculationSupply = 0

        return {
          errors: {
            isErrors: false,
            errorMessage: ''
          },
          tokenData: {
            tokenAddress,
            tokenName,
            tokenSymbol,
            tokenDecimals,
            tokenTotalSupply,
            tokenCirculationSupply
          }
        }
      }
    } else {
      return {
        errors: {
          isErrors: true,
          errorMessage: 'invalid user address or contract address'
        },
        tokenData: {
          tokenAddress,
          tokenName,
          tokenSymbol,
          tokenDecimals,
          tokenTotalSupply,
          tokenCirculationSupply
        }
      }
    }
  } catch (error) {
    console.error("ERROR while fetching native balance of an address ", error)
    return {
      errors: {
        isErrors: true,
        errorMessage: 'Something went wrong while calculating token data'
      },
      tokenData: {
        tokenAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenTotalSupply,
        tokenCirculationSupply
      }
    }
  }
}




