import { getChainNetworkByChainId } from '../../Blockchain/utils/chainList'
import { ethers, utils } from 'ethers'
import { configs } from '../web3.config'
import axios from 'axios'

export const getWeb3PRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.JsonRpcProvider(web3configs.rpcUrls[0])
  return web3
}


export const approveTokenForLock = async (
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
    const spender = configs.lpLockContract.contractAddress
    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)

    //get the token decimals
    const tokenDecimalResponse = await erc20ContractInstanceWithSigner.decimals()
    const decimals = parseInt(tokenDecimalResponse.toString())

    const formattedLockingTokenAmount = utils.parseUnits(tokenAmount.toString(), decimals)

    const approveTokenReceipt = await erc20ContractInstanceWithSigner.approve(spender, formattedLockingTokenAmount)
    const result = await approveTokenReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying to approve the token for lock. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getTokenLockCreateFee = async () => {
  let lockFeeInWei = 0
  try {
    const provider = getWeb3PRovider()
    const lockContractABI = JSON.parse(configs.lpLockContract.contractABI)
    const lockContractAddress = configs.lpLockContract.contractAddress
    const lpLockContractInstance = new ethers.Contract(lockContractAddress, lockContractABI, provider)
    const feeResponse = await lpLockContractInstance.fee()
    lockFeeInWei = feeResponse.toString()
    return lockFeeInWei
  } catch (error) {
    console.error("ERROR while fetching token lock fee ", error)
    return lockFeeInWei
  }
}


export const lockTheTokensWithoutVesting = async (
  tokenAddress,
  tokenAmount,
  lockTimeInSeconds,
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

    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)

    //get the token decimals
    const tokenDecimalResponse = await erc20ContractInstanceWithSigner.decimals()
    const decimals = parseInt(tokenDecimalResponse.toString())

    const formattedLockingTokenAmount = utils.parseUnits(tokenAmount.toString(), decimals)

    //create the contract instance of token locker
    const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
    const tokenLockerContractAddress = configs.lpLockContract.contractAddress

    const tokenLockerContractInstance = new ethers.Contract(
      tokenLockerContractAddress,
      tokenLockerContractABI,
      provider
    )

    const tokenLockerContractInstanceWithSigner = tokenLockerContractInstance.connect(signer)
    const isLPToken = false
    //fetch the lock create fee in wei
    const lockCreateFeeInWei = await getTokenLockCreateFee()

    //create lock
    const lockCreateReceipt = await tokenLockerContractInstanceWithSigner.lockTokens(
      tokenAddress,
      formattedLockingTokenAmount,
      lockTimeInSeconds,
      isLPToken,
      { value: lockCreateFeeInWei }
    )
    const result = await lockCreateReceipt.wait()
    let eventData = null
    //TODO :: log changes with diffident wallet address
    if (result && result?.logs.length > 0) {
      const logLength = result?.logs.length
      eventData = result.logs[logLength - 1].data
    }
    //decode the transaction data
    const decodedData = utils.defaultAbiCoder.decode(["uint256", "address", "address", "uint256", "uint256"], eventData)

    return {
      "transactionHash": result.transactionHash,
      "tokenLockId": decodedData[0].toString()
    }
  } catch (error) {
    console.error("ERROR while locking the tokens without vesting ", error)
    let errorMessage = 'Something went wrong while trying to lock the tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const lockTheTokensWithVesting = async (
  tokenAddress,
  tokenAmount,
  initialReleaseTimeInSeconds,
  initialReleasePercentage,
  releaseCyclesInDays,
  releasePercentage,
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

    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)

    //get the token decimals
    const tokenDecimalResponse = await erc20ContractInstanceWithSigner.decimals()
    const decimals = parseInt(tokenDecimalResponse.toString())

    const formattedLockingTokenAmount = utils.parseUnits(tokenAmount.toString(), decimals)

    //create the contract instance of token locker
    const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
    const tokenLockerContractAddress = configs.lpLockContract.contractAddress

    const tokenLockerContractInstance = new ethers.Contract(
      tokenLockerContractAddress,
      tokenLockerContractABI,
      provider
    )

    const tokenLockerContractInstanceWithSigner = tokenLockerContractInstance.connect(signer)
    //fetch the lock create fee in wei
    const lockCreateFeeInWei = await getTokenLockCreateFee()

    //create lock
    const lockCreateReceipt = await tokenLockerContractInstanceWithSigner.lockAndVesting(
      tokenAddress,
      formattedLockingTokenAmount,
      initialReleaseTimeInSeconds,
      initialReleasePercentage,
      releaseCyclesInDays,
      releasePercentage,
      { value: lockCreateFeeInWei }
    )

    const result = await lockCreateReceipt.wait()

    let eventData = null
    //TODO :: log changes with diffident wallet address
    if (result && result?.logs.length > 0) {
      const logLength = result?.logs.length
      eventData = result.logs[logLength - 1].data
    }

    //decode the transaction data
    const decodedData = utils.defaultAbiCoder.decode(["uint256", "address", "address", "uint256", "uint256"], eventData)

    return {
      "transactionHash": result.transactionHash,
      "tokenLockId": decodedData[0].toString()
    }

  } catch (error) {
    console.error("ERROR while locking the tokens with vesting ", error)
    let errorMessage = 'Something went wrong while trying to lock the tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const saveLockTokenDataInDatabase = async (payload) => {
  try {

    let config = {
      method: 'post',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/create`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    if (apiResponse.status === 200) {
      const lockRecordResponse = apiResponse.data.payload.tokenRecordDetails
      return lockRecordResponse
    }
    return null

  } catch (error) {
    console.log("ERROR while saving token lock data in database ", error)
    let errorMessage = "Something went wrong while trying to save token lock details in our servers"
    throw errorMessage
  }
}

export const saveLiquidityLockDataInDatabase = async (payload) => {
  try {

    let config = {
      method: 'post',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/create`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    if (apiResponse.status === 200) {
      const lockRecordResponse = apiResponse.data.payload.tokenRecordDetails
      return lockRecordResponse
    }
    return null

  } catch (error) {
    console.log("ERROR while saving token lock data in database ", error)
    let errorMessage = "Something went wrong while trying to save token lock details in our servers"
    throw errorMessage
  }
}


export const updateLockRecordTxDetails = async (payload, id) => {
  try {

    let config = {
      method: 'patch',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/update-lock-record/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    return apiResponse

  } catch (error) {
    console.log("ERROR while updating token lock transaction data in database ", error)
    let errorMessage = "Something went wrong while trying to updating token transaction data"
    throw errorMessage
  }
}

export const updateLiquidityLockRecordTxDetails = async (payload, id) => {
  try {

    let config = {
      method: 'patch',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/update-lock-record/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    return apiResponse

  } catch (error) {
    console.log("ERROR while updating token lock transaction data in database ", error)
    let errorMessage = "Something went wrong while trying to updating token transaction data"
    throw errorMessage
  }
}

export const getTokenLockDetailsForNonVestingLocksById = async (lockeId) => {
  let tokenAddress = null
  let ownerAddress = null
  let lockedAmount = 0.0
  let lockedDateTimestamp = 0
  let unlockDateTimestamp = 0
  let claimedAtTimestamp = 0
  let isClaimed = false
  let tokenName = null
  let tokenSymbol = null
  let tokenDecimals = 0
  let tokenLockedAmountFormatted = 0.0

  try {
    if (lockeId) {
      const provider = getWeb3PRovider()
      const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
      const tokenLockerContractAddress = configs.lpLockContract.contractAddress

      const tokenLockerContractInstance = new ethers.Contract(
        tokenLockerContractAddress,
        tokenLockerContractABI,
        provider
      )

      const lockedDetails = await tokenLockerContractInstance.lockerDetails(lockeId)
      tokenAddress = lockedDetails[0]
      ownerAddress = lockedDetails[1]
      lockedAmount = lockedDetails[2].toString()
      lockedDateTimestamp = parseInt(lockedDetails[3].toString())
      unlockDateTimestamp = parseInt(lockedDetails[4].toString())
      claimedAtTimestamp = parseInt(lockedDetails[5].toString())
      isClaimed = lockedDetails[6]

      //create the instance of common ERC 20 token 

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
      const erc20ContractInstance = new ethers.Contract(
        tokenAddress,
        erc20TokenABI,
        provider
      )
      tokenName = await erc20ContractInstance.name()
      tokenSymbol = await erc20ContractInstance.symbol()
      const tokenDecimalResponse = await erc20ContractInstance.decimals()
      tokenDecimals = parseInt(tokenDecimalResponse.toString())
      const tokenAmountFormatted = utils.formatUnits(lockedAmount, tokenDecimals)
      tokenLockedAmountFormatted = tokenAmountFormatted.toString()
      return {
        tokenAddress,
        ownerAddress,
        lockedAmount,
        lockedDateTimestamp,
        unlockDateTimestamp,
        claimedAtTimestamp,
        isClaimed,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenLockedAmountFormatted
      }

    } else {
      return {
        tokenAddress,
        ownerAddress,
        lockedAmount,
        lockedDateTimestamp,
        unlockDateTimestamp,
        claimedAtTimestamp,
        isClaimed,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenLockedAmountFormatted
      }
    }
  } catch (error) {
    console.error("ERROR while fetching token lock details ", error)
    return {
      tokenAddress,
      ownerAddress,
      lockedAmount,
      lockedDateTimestamp,
      unlockDateTimestamp,
      claimedAtTimestamp,
      isClaimed,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenLockedAmountFormatted
    }

  }
}

export const getTokenLockDetailsForWithVestingLocksById = async (lockeId) => {
  let tokenAddress = null
  let ownerAddress = null
  let lockedAmount = 0.0
  let lockedDateTimestamp = 0
  let unlockDateTimestamp = 0
  let initialPercentage = 0
  let releaseCycle = 0
  let releasePercentage = null
  let lastClaimTimestamp = 0
  let nextClaimTimestamp = 0
  let remainingTokensAmount = 0
  let remainingTokenAmountFormatted = 0.0
  let isTotallyClaimed = false
  let isInitiallyClaimed = false
  let tokenName = null
  let tokenSymbol = null
  let tokenDecimals = 0
  let unlockTokenAmountFormatted = 0.0
  let tokenLockedAmountFormatted = 0.0

  try {
    if (lockeId) {
      const provider = getWeb3PRovider()
      const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
      const tokenLockerContractAddress = configs.lpLockContract.contractAddress

      const tokenLockerContractInstance = new ethers.Contract(
        tokenLockerContractAddress,
        tokenLockerContractABI,
        provider
      )

      const lockedDetails = await tokenLockerContractInstance.vestingLockerDetails(lockeId)
      tokenAddress = lockedDetails[0]
      ownerAddress = lockedDetails[1]
      lockedAmount = lockedDetails[2]
      lockedDateTimestamp = parseInt(lockedDetails[3].toString())
      initialPercentage = parseInt(lockedDetails[4].toString())
      releaseCycle = parseInt(lockedDetails[5].toString())
      releasePercentage = parseInt(lockedDetails[6].toString())
      lastClaimTimestamp = parseInt(lockedDetails[7].toString())
      nextClaimTimestamp = parseInt(lockedDetails[8].toString())
      remainingTokensAmount = lockedDetails[9]
      isTotallyClaimed = parseInt(lockedDetails[10].toString())
      isInitiallyClaimed = parseInt(lockedDetails[11].toString())

      unlockDateTimestamp = nextClaimTimestamp

      //create the instance of common ERC 20 token 
      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
      const erc20ContractInstance = new ethers.Contract(
        tokenAddress,
        erc20TokenABI,
        provider
      )
      tokenName = await erc20ContractInstance.name()
      tokenSymbol = await erc20ContractInstance.symbol()
      const tokenDecimalResponse = await erc20ContractInstance.decimals()
      tokenDecimals = parseInt(tokenDecimalResponse.toString())
      const tokenAmountFormatted = utils.formatUnits(lockedAmount, tokenDecimals)
      tokenLockedAmountFormatted = tokenAmountFormatted.toString()

      const remainingTokenAmountResponse = utils.formatUnits(remainingTokensAmount, tokenDecimals)
      remainingTokenAmountFormatted = remainingTokenAmountResponse


      const unlockTokens = lockedAmount.sub(remainingTokensAmount)
      const unlockTokenAmountResponse = utils.formatUnits(unlockTokens, tokenDecimals)
      unlockTokenAmountFormatted = unlockTokenAmountResponse.toString()
      return {
        tokenAddress,
        ownerAddress,
        lockedAmount,
        lockedDateTimestamp,
        unlockDateTimestamp,
        initialPercentage,
        releaseCycle,
        releasePercentage,
        lastClaimTimestamp,
        nextClaimTimestamp,
        remainingTokensAmount,
        remainingTokenAmountFormatted,
        isTotallyClaimed,
        isInitiallyClaimed,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenLockedAmountFormatted,
        unlockTokenAmountFormatted
      }

    } else {
      return {
        tokenAddress,
        ownerAddress,
        lockedAmount,
        lockedDateTimestamp,
        unlockDateTimestamp,
        initialPercentage,
        releaseCycle,
        releasePercentage,
        lastClaimTimestamp,
        nextClaimTimestamp,
        remainingTokensAmount,
        remainingTokenAmountFormatted,
        isTotallyClaimed,
        isInitiallyClaimed,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenLockedAmountFormatted,
        unlockTokenAmountFormatted
      }
    }
  } catch (error) {
    console.error("ERROR while fetching token lock details ", error)
    return {
      tokenAddress,
      ownerAddress,
      lockedAmount,
      lockedDateTimestamp,
      unlockDateTimestamp,
      initialPercentage,
      releaseCycle,
      releasePercentage,
      lastClaimTimestamp,
      nextClaimTimestamp,
      remainingTokensAmount,
      remainingTokenAmountFormatted,
      isTotallyClaimed,
      isInitiallyClaimed,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenLockedAmountFormatted,
      unlockTokenAmountFormatted
    }

  }
}

export const renounceLockOwnership = async (
  lockId,
  signer
) => {
  try {

    if (lockId) {
      const newOwnerAddress = '0x0000000000000000000000000000000000000000'
      const provider = getWeb3PRovider()

      //create the contract instance of token locker
      const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
      const tokenLockerContractAddress = configs.lpLockContract.contractAddress

      const tokenLockerContractInstance = new ethers.Contract(
        tokenLockerContractAddress,
        tokenLockerContractABI,
        provider
      )

      const tokenLockerContractInstanceWithSigner = tokenLockerContractInstance.connect(signer)
      //fetch the lock create fee in wei

      //create lock
      const renounceLockOwnershipReceipt = await tokenLockerContractInstanceWithSigner.transferLockerOwnerShip(lockId, newOwnerAddress)
      const result = await renounceLockOwnershipReceipt.wait()
      return result
    } else {
      let errorMessage = 'Please enter the valid locker id to renounce ownership'
      throw errorMessage
    }


  } catch (error) {
    console.error("ERROR while trying to renounce ownership of the locker ", error)
    let errorMessage = 'Something went wrong while trying to renounce ownership of the lock. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const renounceTokenLockOwnershipAPI = async (txHash) => {
  try {

    const payload = {
      tokenOwner: "0x0000000000000000000000000000000000000000"
    }
    let config = {
      method: 'patch',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/update-ownership/${txHash}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    return apiResponse

  } catch (error) {
    console.log("ERROR while renouncing token lock ownership ", error)
    let errorMessage = "Something went wrong while trying to renouncing token lock ownership"
    throw errorMessage
  }
}

export const renounceLPTokenLockOwnershipAPI = async (txHash) => {
  try {

    const payload = {
      tokenOwner: "0x0000000000000000000000000000000000000000"
    }
    let config = {
      method: 'patch',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/update-ownership/${txHash}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    };

    const apiResponse = await axios(config)
    return apiResponse

  } catch (error) {
    console.log("ERROR while renouncing token lock ownership ", error)
    let errorMessage = "Something went wrong while trying to renouncing token lock ownership"
    throw errorMessage
  }
}

export const unlockTheTokens = async (
  lockId,
  signer
) => {
  try {

    if (lockId) {
      const provider = getWeb3PRovider()

      //create the contract instance of token locker
      const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
      const tokenLockerContractAddress = configs.lpLockContract.contractAddress

      const tokenLockerContractInstance = new ethers.Contract(
        tokenLockerContractAddress,
        tokenLockerContractABI,
        provider
      )

      const tokenLockerContractInstanceWithSigner = tokenLockerContractInstance.connect(signer)
      //fetch the lock create fee in wei
      let tokenUnlockReceipt = null
      const iSVestingEnabled = await tokenLockerContractInstanceWithSigner.isVesting(lockId)
      if (iSVestingEnabled) {
        tokenUnlockReceipt = await tokenLockerContractInstanceWithSigner.unlockVesting(lockId)
      } else {
        tokenUnlockReceipt = await tokenLockerContractInstanceWithSigner.unlockTokens(lockId)
      }
      //unlock the tokens
      const result = await tokenUnlockReceipt.wait()
      return result
    } else {
      let errorMessage = 'Please enter the valid locker id to unlock the tokens'
      throw errorMessage
    }


  } catch (error) {
    console.error("ERROR while trying to unlock the tokens ", error)
    let errorMessage = 'Something went wrong while trying to unlock the tokens. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}


export const extendLockExpireTime = async (
  lockId,
  newLockTime,
  signer
) => {
  try {

    if (lockId && newLockTime) {
      const provider = getWeb3PRovider()

      //create the contract instance of token locker
      const tokenLockerContractABI = JSON.parse(configs.lpLockContract.contractABI)
      const tokenLockerContractAddress = configs.lpLockContract.contractAddress

      const tokenLockerContractInstance = new ethers.Contract(
        tokenLockerContractAddress,
        tokenLockerContractABI,
        provider
      )

      const tokenLockerContractInstanceWithSigner = tokenLockerContractInstance.connect(signer)
      //fetch the lock create fee in wei

      const extendedLockTimeReceipt = await tokenLockerContractInstanceWithSigner.extendLockerExpireTime(lockId, newLockTime)
      const result = await extendedLockTimeReceipt.wait()
      return result
    } else {
      let errorMessage = 'Please enter the valid locker id to extend the expire time'
      throw errorMessage
    }


  } catch (error) {
    console.error("ERROR while trying to extend lock expire time ", error)
    let errorMessage = 'Something went wrong while trying to extend lock expire time. Please try again'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getTokenLockerDetails = async (id) => {

  let lockerDetails = []
  try {

    const provider = getWeb3PRovider()
    const lockContractABI = JSON.parse(configs.locketDetailContract.contractABI)
    const lockContractAddress = configs.locketDetailContract.contractAddress
    const lpLockContractInstance = new ethers.Contract(lockContractAddress, lockContractABI, provider)
    const lockerDetailResponse = await lpLockContractInstance.lockerDetails(id)
    
    lockerDetails = lockerDetailResponse
  return lockerDetails

  } catch (error) {

    return lockerDetails
  }
}