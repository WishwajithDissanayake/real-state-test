import { getChainNetworkByChainId } from '../../Blockchain/utils/chainList'
import { ethers, utils } from 'ethers'
import { configs } from '../web3.config'
import { preSaleConfigs } from "../configs/presale.config"
import { DateTime } from 'luxon'
import { getWeb3ViaWebsocketPRovider } from './common.service'
import axios from 'axios'

export const getWeb3PRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.JsonRpcProvider(web3configs.rpcUrls[0])
  return web3
}

export const getPreSaleCreateFee = async () => {
  let poolCreateFeeInBNB = 0.0
  try {
    const provider = getWeb3PRovider()
    const presaleContractAddress = preSaleConfigs.preSaleContractAddress
    const presaleContractABI = JSON.parse(preSaleConfigs.preSaleContractABI)
    const presaleContractInstance = new ethers.Contract(presaleContractAddress, presaleContractABI, provider)
    const presaleFee = await presaleContractInstance.feeAmount()
    const poolCreateFee = utils.formatEther(presaleFee)
    poolCreateFeeInBNB = poolCreateFee
    return poolCreateFeeInBNB
  } catch (error) {
    console.log("ERROR while fetching pool creation fee")
    return poolCreateFeeInBNB

  }
}

export const getPresaleTokenFeePercentage = async () => {
  let tokenFeePercentage = 0.0
  try {
    const provider = getWeb3PRovider()
    const presaleContractAddress = preSaleConfigs.preSaleContractAddress
    const presaleContractABI = JSON.parse(preSaleConfigs.preSaleContractABI)
    const presaleContractInstance = new ethers.Contract(presaleContractAddress, presaleContractABI, provider)
    const tokenFeePercentageResponse = await presaleContractInstance.tokenFeePercentage()
    const formattedTokenFeePercentage = utils.formatUnits(tokenFeePercentageResponse, 2)
    tokenFeePercentage = formattedTokenFeePercentage
    return tokenFeePercentage
  } catch (error) {
    console.log("ERROR while fetching token fee percentage")
    return tokenFeePercentage

  }
}

export const getPresaleTokenFeePercentageAsBigNumber = async () => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractAddress = preSaleConfigs.preSaleContractAddress
    const presaleContractABI = JSON.parse(preSaleConfigs.preSaleContractABI)
    const presaleContractInstance = new ethers.Contract(presaleContractAddress, presaleContractABI, provider)
    return await presaleContractInstance.tokenFeePercentage()
  } catch (error) {
    console.log("ERROR while fetching token fee percentage")
    return null

  }
}

export const approveTokens = async (
  tokenAddress,
  tokenAmount,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const erc20ContractInstance = new ethers.Contract(
      tokenAddress,
      erc20TokenABI,
      provider
    )
    const spender = preSaleConfigs.preSaleContractAddress
    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)

    const approveTokenReceipt = await erc20ContractInstanceWithSigner.approve(spender, tokenAmount)
    const result = await approveTokenReceipt.wait()
    return result
  } catch (error) {

    let errorMessage = 'Something went wrong while trying to approve the token. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const approveTokensForBEP20 = async (
  tokenAddress,
  tokenAmount,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const erc20ContractInstance = new ethers.Contract(
      tokenAddress,
      erc20TokenABI,
      provider
    )
    const spender = preSaleConfigs.preSaleContractAddressForBEP20
    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)

    const approveTokenReceipt = await erc20ContractInstanceWithSigner.approve(spender, tokenAmount)
    const result = await approveTokenReceipt.wait()
    return result
  } catch (error) {

    let errorMessage = 'Something went wrong while trying to approve the token. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const createNewPresaleWithBNB = async (
  tokenAddressArray,
  poolDetails,
  vestingDetails,
  isWhiteListingEnabled,
  publicStartTime,
  isLiquidityBurn,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const presaleContractAddress = preSaleConfigs.preSaleContractAddress
    const presaleContractABI = JSON.parse(preSaleConfigs.preSaleContractABI)
    const presaleContractInstance = new ethers.Contract(presaleContractAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const poolCreationFeeResponse = await presaleContractInstanceWithSigner.feeAmount()
    const actualFeeAmount = poolCreationFeeResponse.toString()
    const newPoolCreateReceipt = await presaleContractInstanceWithSigner.createNewPool(
      tokenAddressArray,
      poolDetails,
      vestingDetails,
      isWhiteListingEnabled,
      publicStartTime,
      isLiquidityBurn,
      { value: actualFeeAmount }
    )

    const result = await newPoolCreateReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to crete presale pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const createNewPresaleWithBEP20 = async (
  poolDetails,
  vestingDetails,
  isWhiteListingEnabled,
  publicStartTime,
  addressList,
  isLiquidityBurn,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const presaleContractAddress = preSaleConfigs.preSaleContractAddressForBEP20
    const presaleContractABI = JSON.parse(preSaleConfigs.preSaleContractBEP20ABI)
    const presaleContractInstance = new ethers.Contract(presaleContractAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const poolCreationFeeResponse = await presaleContractInstanceWithSigner.feeAmount()
    const actualFeeAmount = poolCreationFeeResponse.toString()
    const newPoolCreateReceipt = await presaleContractInstanceWithSigner.createNewPool(
      poolDetails,
      vestingDetails,
      isWhiteListingEnabled,
      publicStartTime,
      addressList,
      isLiquidityBurn,
      { value: actualFeeAmount }
    )

    const result = await newPoolCreateReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to crete presale pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getWhitelistedAddresses = async (poolAddress) => {
  let whitelistedAdd = []

  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const whitelistedResponse = await presaleContractInstance.getWhiteListedUsers()

    if (whitelistedResponse) {
      whitelistedAdd = whitelistedResponse
      return (whitelistedAdd)
    }
  } catch (error) {
    console.error("ERROR while fetching whitelisted addresses: ", error)
    throw new Error(error)
  }
}

export const getPoolStatusViaWebsocket = async (poolAddress) => {

  let statusCode = ''
  let statusName = ''
  let statusColor = ''
  let canContribute = false
  let message = ''
  try {
    const provider = getWeb3ViaWebsocketPRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const poolStatusResponse = await presaleContractInstance.poolStatus()
    const poolStatus = parseInt(poolStatusResponse.toString())

    const startTimeResponse = await presaleContractInstance.startTime()
    const startTime = parseInt(startTimeResponse.toString())

    const endTimeResponse = await presaleContractInstance.endTime()
    const endTime = parseInt(endTimeResponse.toString())

    const hardCapResponse = await presaleContractInstance.hardCap()
    const hardCap = parseInt(hardCapResponse.toString())

    const filledBNBResponse = await presaleContractInstance.filledBNB()
    const filledBNB = parseInt(filledBNBResponse.toString())

    if (poolStatus === 4) {
      statusCode = 'finalized'
      statusName = 'Finalized'
      statusColor = 'orange'
      canContribute = false
      message = 'This pool has been finalized'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (poolStatus === 3) {
      statusCode = 'canceled'
      statusName = 'Canceled'
      statusColor = 'grey'
      canContribute = false
      message = 'This pool has been canceled'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    //get the current timestamp in seconds
    const currentUTC = parseInt(DateTime.now().toSeconds())
    if (currentUTC >= startTime && filledBNB < hardCap && currentUTC <= endTime) {
      statusCode = 'live'
      statusName = 'Ongoing'
      statusColor = 'green'
      canContribute = true
      message = ''
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (currentUTC >= startTime && filledBNB === hardCap) {
      statusCode = 'filled'
      statusName = 'Filled'
      statusColor = 'green'
      canContribute = false
      message = 'This pool has been filled'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (currentUTC >= endTime) {
      statusCode = 'ended'
      statusName = 'Sale Ended'
      statusColor = 'red'
      message = 'This pool has been ended'
      return {
        statusCode,
        statusName,
        statusColor,
        message,
        poolStatus
      }
    }

    if (currentUTC < startTime) {
      statusCode = 'upcoming'
      statusName = 'Upcoming'
      statusColor = 'orange'
      canContribute = true
      message = 'This pool is not started yet'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }
  } catch (error) {
    console.error("ERROR while fetching token pool status : ", error)
    throw new Error(error)
  }
}

export const getPoolStatus = async (poolAddress) => {

  let statusCode = ''
  let statusName = ''
  let statusColor = ''
  let canContribute = false
  let message = ''
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const poolStatusResponse = await presaleContractInstance.poolStatus()
    const poolStatus = parseInt(poolStatusResponse.toString())

    const startTimeResponse = await presaleContractInstance.startTime()
    const startTime = parseInt(startTimeResponse.toString())

    const endTimeResponse = await presaleContractInstance.endTime()
    const endTime = parseInt(endTimeResponse.toString())

    const hardCapResponse = await presaleContractInstance.hardCap()
    const hardCap = parseInt(hardCapResponse.toString())

    const filledBNBResponse = await presaleContractInstance.filledBNB()
    const filledBNB = parseInt(filledBNBResponse.toString())

    if (poolStatus === 4) {
      statusCode = 'finalized'
      statusName = 'Finalized'
      statusColor = 'orange'
      canContribute = false
      message = 'This pool has been finalized'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (poolStatus === 3) {
      statusCode = 'canceled'
      statusName = 'Canceled'
      statusColor = 'grey'
      canContribute = false
      message = 'This pool has been canceled'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    //get the current timestamp in seconds
    const currentUTC = parseInt(DateTime.now().toSeconds())
    if (currentUTC >= startTime && filledBNB < hardCap && currentUTC <= endTime) {
      statusCode = 'live'
      statusName = 'Ongoing'
      statusColor = 'green'
      canContribute = true
      message = ''
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (currentUTC >= startTime && filledBNB === hardCap) {
      statusCode = 'filled'
      statusName = 'Filled'
      statusColor = 'green'
      canContribute = false
      message = 'This pool has been filled'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }

    if (currentUTC >= endTime) {
      statusCode = 'ended'
      statusName = 'Sale Ended'
      statusColor = 'red'
      message = 'This pool has been ended'
      return {
        statusCode,
        statusName,
        statusColor,
        message,
        poolStatus
      }
    }

    if (currentUTC < startTime) {
      statusCode = 'upcoming'
      statusName = 'Upcoming'
      statusColor = 'orange'
      canContribute = true
      message = 'This pool is not started yet'
      return {
        statusCode,
        statusName,
        statusColor,
        canContribute,
        message,
        poolStatus
      }
    }
  } catch (error) {
    console.error("ERROR while fetching token pool status : ", error)
    throw new Error(error)
  }
}

export const getPoolProgressDetails = async (poolAddress) => {

  let minContributionAmount = 0.0
  let maxContributionAmount = 0.0
  let hardCap = 0.0
  let bnbFilledSoFar = 0.0
  let progressPercentage = 0.0

  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const hardCapResponse = await presaleContractInstance.hardCap()
    hardCap = parseFloat(utils.formatEther(hardCapResponse.toString()))

    const filledBNBResponse = await presaleContractInstance.filledBNB()
    bnbFilledSoFar = parseFloat(utils.formatEther(filledBNBResponse.toString()))

    const minimumContributionResponse = await presaleContractInstance.minimumParticipate()
    minContributionAmount = parseFloat(utils.formatEther(minimumContributionResponse.toString()))

    const maximumContributionResponse = await presaleContractInstance.maximumParticipate()
    maxContributionAmount = parseFloat(utils.formatEther(maximumContributionResponse.toString()))
    progressPercentage = (bnbFilledSoFar / hardCap) * 100

    return {
      minContributionAmount,
      maxContributionAmount,
      hardCap,
      bnbFilledSoFar,
      progressPercentage
    }

  } catch (error) {
    console.error("ERROR while fetching token pool status : ", error)
    return {
      minContributionAmount,
      maxContributionAmount,
      hardCap,
      bnbFilledSoFar,
      progressPercentage
    }
  }
}

export const getTheOwnerOfThePool = async (poolAddress) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const owner = await presaleContractInstance.poolOwner()
    return owner
  } catch (error) {
    console.error("ERROR while fetching pool owner  : ", error)
    return null
  }
}

export const getLiquidityProviderDetailsByRouterAddress = (routerAddress) => {
  const liquidityProvidersList = preSaleConfigs.liquidityProviders
  if (routerAddress) {
    return liquidityProvidersList.find(item =>
      item.routerAddress.toLowerCase() === routerAddress.toLowerCase()
    )
  } else {
    return null
  }

}

export const contributeToPrivateSale = async (
  poolAddress,
  contributionAmountInBNB,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const contributionReceipt = await presaleContractInstanceWithSigner.participateToSale({ value: contributionAmountInBNB })
    const result = await contributionReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to contribute to the pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const approveCustomCurrencyToken = async (
  poolAddress,
  customCurrencyAddress,
  tokenAmount,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const erc20ContractInstance = new ethers.Contract(
      customCurrencyAddress,
      erc20TokenABI,
      provider
    )
    const spender = poolAddress
    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)
    const approveTokenReceipt = await erc20ContractInstanceWithSigner.approve(spender, tokenAmount)
    const result = await approveTokenReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to approve custom currency token. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const contributeToPrivateSaleWithCustomCurrency = async (
  poolAddress,
  contributionAmountInBNB,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolBEP20ContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const contributionReceipt = await presaleContractInstanceWithSigner.participateToSale(contributionAmountInBNB.toString())
    const result = await contributionReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to contribute to the pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getUserContributionDetails = async (poolAddress, walletAddress, liquidityTokenName) => {
  let myContributionInBNB = 0.0
  let userTokenReserved = null
  let isClaimed = false
  let lastClaimedTokenAmount = 0
  let lastClaimedTimestamp = 0
  let nextClaimedTimestamp = 0
  let totalClaimedTokenAmount = 0
  let remainingClaimableTokenAmount = 0

  try {

    if (poolAddress && walletAddress) {
      const provider = getWeb3PRovider()

      let presaleContractABI = null
      if (liquidityTokenName === "BNB") {
        presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
      } else {
        //TODO contract ABI non BNB tokens
        presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
      }
      const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
      const userContributionDetails = await presaleContractInstance.shares(walletAddress)

      const myContributionInWei = userContributionDetails[0].toString()
      myContributionInBNB = utils.formatEther(myContributionInWei)
      //get the token address and token decimals if eligible
      const tokenAddress = await presaleContractInstance.tokenAddress()

      isClaimed = userContributionDetails[3]

      const erc20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const erc20ContractInstance = new ethers.Contract(tokenAddress.toString(), erc20ContractABI, provider)
      const tokenDecimalResponse = await erc20ContractInstance.decimals()
      const tokenDecimals = parseInt(tokenDecimalResponse.toString())
      const userTokensReservedResponse = userContributionDetails[1].toString()
      userTokenReserved = utils.formatUnits(userTokensReservedResponse, tokenDecimals)

      const lastClaimedTokenAmountFormatted = utils.formatUnits(userContributionDetails[4], tokenDecimals)
      lastClaimedTokenAmount = lastClaimedTokenAmountFormatted.toString()
      lastClaimedTimestamp = parseInt(userContributionDetails[5]?.toString())
      nextClaimedTimestamp = parseInt(userContributionDetails[6]?.toString())

      const totalClaimedTokenAmountFormatted = utils.formatUnits(userContributionDetails[7], tokenDecimals)
      totalClaimedTokenAmount = totalClaimedTokenAmountFormatted.toString()

      const remainingClaimableTokenAmountFormatted = utils.formatUnits(userContributionDetails[8], tokenDecimals)
      remainingClaimableTokenAmount = remainingClaimableTokenAmountFormatted.toString()
      return {
        myContributionInBNB,
        userTokenReserved,
        isClaimed,
        lastClaimedTokenAmount,
        lastClaimedTimestamp,
        nextClaimedTimestamp,
        totalClaimedTokenAmount,
        remainingClaimableTokenAmount
      }
    }
  } catch (error) {
    console.error("ERROR while fetching user contribution details  : ", error)
    return {
      myContributionInBNB,
      userTokenReserved,
      isClaimed,
      lastClaimedTokenAmount,
      lastClaimedTimestamp,
      nextClaimedTimestamp,
      totalClaimedTokenAmount,
      remainingClaimableTokenAmount
    }
  }
}

export const getMinAndMaxContributionAmount = async (poolAddress) => {
  let minContributionAmount = 0.0
  let maxContributionAmount = 0.0
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

    const minimumContributionResponse = await presaleContractInstance.minimumParticipate()
    minContributionAmount = parseFloat(utils.formatEther(minimumContributionResponse.toString()))

    const maximumContributionResponse = await presaleContractInstance.maximumParticipate()
    maxContributionAmount = parseFloat(utils.formatEther(maximumContributionResponse.toString()))

    return {
      minContributionAmount,
      maxContributionAmount
    }

  } catch (error) {
    console.error("ERROR while fetching min max contribution amount  : ", error)
    return {
      minContributionAmount,
      maxContributionAmount
    }
  }
}

export const getTotalContributorsCount = async (poolAddress) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const totalContributors = await presaleContractInstance.investorCount()
    return parseInt(totalContributors.toString())

  } catch (error) {
    console.error("ERROR while fetching total contributors count  : ", error)
    return 0
  }
}

export const getTokensPerBNBInPool = async (poolAddress) => {
  try {
    if (poolAddress) {
      const provider = getWeb3PRovider()
      const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
      const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
      const tokensPerBNB = await presaleContractInstance.tokensPerbnb()
      //get the token address of the pool
      const tokenAddress = await presaleContractInstance.tokenAddress()
      const erc20ContractABI = JSON.parse(configs.commonERC20ContractABI)
      const erc20ContractInstance = new ethers.Contract(tokenAddress.toString(), erc20ContractABI, provider)

      const tokenDecimalResponse = await erc20ContractInstance.decimals()
      const tokenDecimals = parseInt(tokenDecimalResponse.toString())

      return utils.formatUnits(tokensPerBNB, tokenDecimals)
    }

  } catch (error) {
    console.error("ERROR while fetching tokens per bnb amount  : ", error)
    return 0
  }
}


export const claimAndExitFromPool = async (poolAddress, signer) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const claimYourBNBReceipt = await presaleContractInstanceWithSigner.claimBnb()
    const result = await claimYourBNBReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to claim your invested BNB. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const claimTokensFromPool = async (poolAddress, signer) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const claimYourTokensReceipt = await presaleContractInstanceWithSigner.claimTokens({ gasLimit: '5000000' })
    const result = await claimYourTokensReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to claim your tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const claimVestedTokensFromPool = async (poolAddress, signer) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const claimYourVestedTokensReceipt = await presaleContractInstanceWithSigner.claimVesting({ gasLimit: '5000000' })
    const result = await claimYourVestedTokensReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to claim your vesting tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const claimRewardsTokensFromPool = async (poolAddress, signer) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const claimYourTokensReceipt = await presaleContractInstanceWithSigner.claimRewards()
    const result = await claimYourTokensReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to claim your rewards tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getPoolVestingStatus = async (poolAddress) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const poolVestingStatus = await presaleContractInstance.isVesting()
    return poolVestingStatus
  } catch (error) {
    console.error("ERROR while getting pool vesting status  : ", error)
    return false
  }
}

export const getRewardTokenSetStatus = async (poolAddress) => {

  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const isRewardsTokenSet = await presaleContractInstance.isRewardTokenSet()
    return isRewardsTokenSet

  } catch (error) {
    console.error("ERROR while checking rewards token set status  : ", error)
    return null
  }
}

export const setRewardsToken = async (
  poolAddress,
  rewardsTokenAddress,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const setRewardsTokenReceipt = await presaleContractInstanceWithSigner.setRewardToken(rewardsTokenAddress)
    const result = await setRewardsTokenReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to setting the reward token. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getPoolFinalizedStatus = async (poolAddress) => {
  let isPoolFinalized = false
  let poolFinalizedAtTimestamp = 0
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const poolFinalizedAt = await presaleContractInstance.finalizedAt()
    const poolFinalizedAtNumber = parseInt(poolFinalizedAt.toString())
    if (poolFinalizedAtNumber) {
      isPoolFinalized = true
      poolFinalizedAtTimestamp = poolFinalizedAtNumber
    } else {
      isPoolFinalized = false
      poolFinalizedAtTimestamp = poolFinalizedAtNumber
    }
    return {
      isPoolFinalized,
      poolFinalizedAtTimestamp
    }
  } catch (error) {
    console.error("ERROR while getting pool finalized  status  : ", error)
    return {
      isPoolFinalized,
      poolFinalizedAtTimestamp
    }
  }
}

export const finalizedPool = async (
  poolAddress,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const finalizedPoolReceipt = await presaleContractInstanceWithSigner.finalizePool()
    const result = await finalizedPoolReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to finalized the private sale pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}


export const finalizedPoolForBEP20Tokens = async (
  poolAddress,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolBEP20ContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    //TODO remove hardcode gas limit
    const finalizedPoolReceipt = await presaleContractInstanceWithSigner.finalizePool()
    const result = await finalizedPoolReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to finalized the private sale pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const cancelPool = async (
  poolAddress,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const finalizedPoolReceipt = await presaleContractInstanceWithSigner.cancelPool()
    const result = await finalizedPoolReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to cancel the private sale pool. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}


export const startClaiming = async (
  poolAddress,
  signer
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const finalizedPoolReceipt = await presaleContractInstanceWithSigner.startClaiming()
    const result = await finalizedPoolReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to start the claiming. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}


export const getPoolWhiteListedStatus = async (
  poolAddress,
) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const poolWhiteListStatus = await presaleContractInstance.isWhitelisted()
    return poolWhiteListStatus
  } catch (error) {
    console.error("ERROR while getting pool whitelist status  : ", error)
    return false
  }
}

export const whitelistUsers = async (poolAddress, walletAddress, signer) => {
  try {
    const provider = getWeb3PRovider()
    const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
    const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)
    const presaleContractInstanceWithSigner = presaleContractInstance.connect(signer)
    const whitelistUsersReceipt = await presaleContractInstanceWithSigner.whiteListUsers(walletAddress)
    const result = await whitelistUsersReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to whitelist addresses. Please try again'
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const calculatePresalePieChart = async (presaleData) => {
  try {
    const provider = getWeb3PRovider()
    const tokenAddress = presaleData.tokenAddress
    if (tokenAddress) {
      const erc20TokenContractABI = JSON.parse(configs.commonERC20ContractABI)
      const erc20ContractInstance = new ethers.Contract(tokenAddress, erc20TokenContractABI, provider)
      const totalSupply = await erc20ContractInstance.totalSupply()

      //total supply amount
      const totalSupplyFormatted = utils.formatUnits(totalSupply.toString(), parseInt(presaleData?.tokenDecimals))
      const totalSupplyResponse = totalSupplyFormatted.toString()

      //tokens for the presale
      const presaleAmountFormatted = utils.formatUnits(presaleData?.totalTokenAmount, parseInt(presaleData?.tokenDecimals))
      const presaleAmountResponse = presaleAmountFormatted.toString()


      let tokensForLiquidity = 0
      if (presaleData?.status !== 'finalized') {
        //tokens for the liquidity
        //check the pool status
        //if status is not equal to finalized then calculate the liquidity percentage using listing rate
        //calculation = listing rate * hard cap -> total tokens for liquidity
        const listingRate = utils.formatUnits(presaleData?.launchRate, parseInt(presaleData?.tokenDecimals))
        const hardCap = utils.formatUnits(presaleData?.hardCap, parseInt(presaleData?.tokenDecimals))
        const eligibleTokensPerLiquidity = parseInt(listingRate.toString()) * parseInt(hardCap.toString())
        const liquidityPercentageLocal = parseFloat(presaleData?.liquidityPercentage)
        const eligibleTokensPerLiquidityFormatted = utils.formatUnits(eligibleTokensPerLiquidity.toString(), parseInt(presaleData?.tokenDecimals))
        tokensForLiquidity = (parseFloat(eligibleTokensPerLiquidityFormatted) / 100) * liquidityPercentageLocal

      } else {
        //get the factory address of the lp router 
        const routerAddress = presaleData?.routerAddress
        const routerContractABI = JSON.parse(configs.pancakeSwap.pcsRouterABI)
        const routerContractInstance = new ethers.Contract(routerAddress, routerContractABI, provider)

        //fetch the factory address
        const factoryAddress = await routerContractInstance.factory()
        const factoryContractABI = JSON.parse(configs.pancakeSwap.pcsFactoryAbi)
        const factoryContractInstance = new ethers.Contract(factoryAddress, factoryContractABI, provider)

        //TODO: remove hardcoded value
        let baseTokenAddress = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'
        const lpPairAddress = await factoryContractInstance.getPair(baseTokenAddress, tokenAddress)
        if (lpPairAddress !== '0x0000000000000000000000000000000000000000') {
          //create the lp pair contract instance
          const lpPairContractABI = JSON.parse(configs.pancakeSwap.lpTokenAbi)
          const lpPairContractInstance = new ethers.Contract(lpPairAddress, lpPairContractABI, provider)
          const reservesAmounts = await lpPairContractInstance.getReserves()
          const tokenAmount = reservesAmounts['_reserve1']
          const tokenAmountFormatted = utils.formatUnits(tokenAmount.toString(), parseInt(presaleData?.tokenDecimals))
          tokensForLiquidity = parseInt(tokenAmountFormatted.toString())
        } else {
          const listingRate = utils.formatUnits(presaleData?.launchRate, parseInt(presaleData?.tokenDecimals))
          const hardCap = utils.formatUnits(presaleData?.hardCap, parseInt(presaleData?.tokenDecimals))
          const eligibleTokensPerLiquidity = parseInt(listingRate.toString()) * parseInt(hardCap.toString())
          const liquidityPercentageLocal = parseFloat(presaleData?.liquidityPercentage)
          const eligibleTokensPerLiquidityFormatted = utils.formatUnits(eligibleTokensPerLiquidity.toString(), parseInt(presaleData?.tokenDecimals))
          tokensForLiquidity = (parseFloat(eligibleTokensPerLiquidityFormatted) / 100) * liquidityPercentageLocal
        }
      }
      //token burnt
      const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
      const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

      const deadAddressBalance = await erc20ContractInstance.balanceOf(DEAD_ADDRESS)
      const zeroAddressBalance = await erc20ContractInstance.balanceOf(ZERO_ADDRESS)

      const totalBurnetBN = deadAddressBalance.add(zeroAddressBalance)
      const totalBurnetFormatted = utils.formatUnits(totalBurnetBN.toString(), parseInt(presaleData?.tokenDecimals))
      const totalBurnetResponse = totalBurnetFormatted.toString()

      const lockRecords = await getTotalLockRecordsForToken(tokenAddress)

      //creating percentage for each items
      const presalePercentage = (parseFloat(presaleAmountResponse) / parseFloat(totalSupplyResponse)) * 100
      const liquidityPercentage = (parseFloat(tokensForLiquidity) / parseFloat(totalSupplyResponse)) * 100
      const burnTokenPercentage = (parseFloat(totalBurnetResponse) / parseFloat(totalSupplyResponse)) * 100

      const presaleTokenMetricsArray = []
      let totalLockTokenPercentage = 0
      if (lockRecords && lockRecords.length > 0) {
        lockRecords.forEach((item) => {
          const tokenLockAmount = parseFloat(item.lockedTokenAmount)
          const percentage = (parseFloat(tokenLockAmount) / parseFloat(totalSupplyResponse)) * 100
          totalLockTokenPercentage += percentage
          const payload = {
            type: item?.title ? item?.title : 'Lock Record',
            value: parseFloat(percentage.toFixed(10))
          }
          presaleTokenMetricsArray.push(payload)
        })
      }

      const unlockTokenPercentage = 100 - (presalePercentage + liquidityPercentage + burnTokenPercentage + totalLockTokenPercentage)

      if (Math.sign(presalePercentage)) {
        const payload = {
          type: 'Presale',
          value: parseFloat(presalePercentage.toFixed(10))
        }
        presaleTokenMetricsArray.push(payload)
      }
      if (Math.sign(presalePercentage)) {
        const payload = {
          type: 'Liquidity',
          value: parseFloat(liquidityPercentage.toFixed(10))
        }
        presaleTokenMetricsArray.push(payload)
      }
      if (Math.sign(burnTokenPercentage)) {
        const payload = {
          type: 'Burnt Tokens',
          value: parseFloat(burnTokenPercentage.toFixed(10))
        }
        presaleTokenMetricsArray.push(payload)
      }
      if (Math.sign(unlockTokenPercentage)) {
        const payload = {
          type: 'Unlocked tokens',
          value: parseFloat(unlockTokenPercentage.toFixed(10))
        }
        presaleTokenMetricsArray.push(payload)
      }
      return presaleTokenMetricsArray
    }
  } catch (error) {
    console.error("ERROR while calculating presale pie chart", error)
    let errorMessage = 'Something went wrong while trying to whitelist addresses. Please try again'
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getAddressWhiteListedStatus = async (poolAddress, ownerAddress) => {
  let whitelistedStatus = false
  try {
    if (poolAddress && ownerAddress) {
      const provider = getWeb3PRovider()
      const presaleContractABI = JSON.parse(preSaleConfigs.presalePoolContractABI)
      const presaleContractInstance = new ethers.Contract(poolAddress, presaleContractABI, provider)

      whitelistedStatus = await presaleContractInstance.isWhiteListed(ownerAddress)
      return whitelistedStatus
    } else {
      return whitelistedStatus
    }

  } catch (error) {
    console.error("ERROR while fetching user whitelisted status  : ", error)
    return whitelistedStatus
  }
}

export const getTotalLockRecordsForToken = async (tokenAddress) => {
  try {
    const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/get-token-lock-records/${tokenAddress}`
    const response = await axios.get(endpoint)
    if (response && response.status === 200) {
      const tokenDetailsResponse = response.data.payload?.items
      return tokenDetailsResponse
    } else {
      return []
    }
  } catch (error) {
    console.error("ERROR while calculating vesting cycles : ", error)
    return []
  }
}