import { getChainNetworkByChainId } from '../../Blockchain/utils/chainList'
import { BigNumber, ethers, utils } from 'ethers'
import { configs } from '../web3.config'
import { stakingConfigs } from '../configs/staking.config'
import { getTokenPriceInUSDByTokenAddress } from './common.service'

export const getWeb3PRovider = () => {
  const defaultChainId = configs.chainId
  const web3configs = getChainNetworkByChainId(defaultChainId)
  //initiate the web3 instance
  const web3 = new ethers.providers.JsonRpcProvider(web3configs.rpcUrls[0])
  return web3
}

export const approveTokensForStaking = async (rewardTokenAddress, tokenAmount, isSameAsStakedToken, signer) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const erc20ContractInstance = new ethers.Contract(
      rewardTokenAddress,
      erc20TokenABI,
      provider
    )

    const erc20ContractInstanceWithSigner = erc20ContractInstance.connect(signer)
    let spender = ''
    if (isSameAsStakedToken) {
      spender = stakingConfigs.stakingContractWithoutRewardsAddress
    } else {
      spender = stakingConfigs.stakingContractWithRewardsAddress
    }
    const approvalReceipt = await erc20ContractInstanceWithSigner.approve(spender, tokenAmount)
    const result = await approvalReceipt.wait()
    return result
  } catch (error) {

    let errorMessage = 'Something went wrong while trying approve the tokens for staking'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const createStakingPoolWithRewardsToken = async (
  stakingTokenAddress,
  rewardsTokenAddress,
  statBlock,
  endBlock,
  poolLimitPerUser,
  lockTimeInSeconds,
  totalRewardsSupply,
  tokenDecimal,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const stakingContractAddressWithRewardsToken = stakingConfigs.stakingContractWithRewardsAddress
    const stakingContractABI = JSON.parse(stakingConfigs.stakingContractWithRewardsABI)
    const stakingContractInstance = new ethers.Contract(
      stakingContractAddressWithRewardsToken,
      stakingContractABI,
      provider
    )


    const stakingContractInstanceWithSigner = stakingContractInstance.connect(signer)
    //get the fee amount
    const feeAmountResponse = await stakingContractInstanceWithSigner.feeAmount()
    const stakingPoolCreateReceipt = await stakingContractInstanceWithSigner.deployPool(
      stakingTokenAddress,
      rewardsTokenAddress,
      statBlock,
      endBlock,
      poolLimitPerUser,
      lockTimeInSeconds,
      totalRewardsSupply,
      tokenDecimal,
      { value: feeAmountResponse.toString() }
    )
    const result = await stakingPoolCreateReceipt.wait()
    return result
  } catch (error) {

    let errorMessage = 'Something went wrong while trying to create staking pool'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const createStakingPoolWithoutRewardsToken = async (
  stakingTokenAddress,
  statBlock,
  endBlock,
  poolLimitPerUser,
  lockTimeInSeconds,
  totalRewardsSupply,
  tokenDecimal,
  signer
) => {

  try {

    const provider = getWeb3PRovider()
    const stakingContractAddressWithRewardsToken = stakingConfigs.stakingContractWithoutRewardsAddress
    const stakingContractABI = JSON.parse(stakingConfigs.stakingContractWithoutRewardsABI)
    const stakingContractInstance = new ethers.Contract(
      stakingContractAddressWithRewardsToken,
      stakingContractABI,
      provider
    )
    const stakingContractInstanceWithSigner = stakingContractInstance.connect(signer)

    //get the fee amount
    const feeAmountResponse = await stakingContractInstanceWithSigner.feeAmount()
    const stakingPoolCreateReceipt = await stakingContractInstanceWithSigner.deployPool(
      stakingTokenAddress,
      statBlock,
      endBlock,
      poolLimitPerUser,
      lockTimeInSeconds,
      totalRewardsSupply,
      tokenDecimal,
      { value: feeAmountResponse.toString() }
    )
    const result = await stakingPoolCreateReceipt.wait()
    return result
  } catch (error) {
    console.log(error)
    let errorMessage = 'Something went wrong while trying to create staking pool'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const fetchStakingAndRewardsTokenDetails = async (stakingPoolContractAddress) => {
  let stakingPoolContractName = ''
  let stakingPoolContractSymbol = ''
  let stakingPoolContractDecimals = ''
  let rewardsPoolContractName = ''
  let rewardsPoolContractSymbol = ''
  let rewardsPoolContractDecimals = ''
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      //staking contract details
      const stakingContractAddress = await stakingPoolContractInstance.stakedToken()
      const stakingTokenContractInstance = new ethers.Contract(
        stakingContractAddress,
        erc20TokenABI,
        provider
      )
      stakingPoolContractName = await stakingTokenContractInstance.name()
      stakingPoolContractSymbol = await stakingTokenContractInstance.symbol()
      stakingPoolContractDecimals = await stakingTokenContractInstance.decimals()


      //rewards token details
      const rewardsTokenAddress = await stakingPoolContractInstance.rewardToken()
      const rewardsTokenContractInstance = new ethers.Contract(
        rewardsTokenAddress,
        erc20TokenABI,
        provider
      )

      rewardsPoolContractName = await rewardsTokenContractInstance.name()
      rewardsPoolContractSymbol = await rewardsTokenContractInstance.symbol()
      rewardsPoolContractDecimals = await rewardsTokenContractInstance.decimals()

    }

    return {
      stakingPoolContractName,
      stakingPoolContractSymbol,
      stakingPoolContractDecimals,
      rewardsPoolContractName,
      rewardsPoolContractSymbol,
      rewardsPoolContractDecimals
    }

  } catch (error) {
    console.log("ERROR while fetching staking and rewards token details ", error)
    return {
      stakingPoolContractName,
      stakingPoolContractSymbol,
      stakingPoolContractDecimals,
      rewardsPoolContractName,
      rewardsPoolContractSymbol,
      rewardsPoolContractDecimals
    }
  }
}

export const calculateAPROfTheStakingPool = async (stakingPoolContractAddress) => {
  let aprPercentage = 0
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      //get the staked token address 
      const stakedTokenResponse = await stakingPoolContractInstance.stakedToken()
      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      const stakeTokenContractInstance = new ethers.Contract(
        stakedTokenResponse,
        erc20TokenABI,
        provider
      )

      const tokenDecimalResponse = await stakeTokenContractInstance.decimals()
      const stakedTokenDecimal = parseInt(tokenDecimalResponse.toString())
      const aprResponse = await stakingPoolContractInstance.accTokenPerShare()
      const precisionFactor = await stakingPoolContractInstance.PRECISION_FACTOR()
      const aprWithoutPercentage = aprResponse.div(precisionFactor)
      const aprResponseFormatted = utils.formatUnits(aprWithoutPercentage.toString(), stakedTokenDecimal)
      aprPercentage = parseFloat(aprResponseFormatted.toString()) * 100

      return aprPercentage
    }
    return aprPercentage
  } catch (error) {
    console.log("ERROR while fetching APR percentage ", error)
    return aprPercentage
  }
}

export const calculateLockDuration = async (stakingPoolContractAddress) => {
  let lockTimeInDays = 0
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )
      const lockTimeInSecondsResponse = await stakingPoolContractInstance.lockTime()
      const lockTimeInSeconds = parseInt(lockTimeInSecondsResponse.toString())
      const SECONDS_PER_DAY = 86400
      lockTimeInDays = parseInt(lockTimeInSeconds / SECONDS_PER_DAY)
      return lockTimeInDays
    }
    return lockTimeInDays
  } catch (error) {
    console.log("ERROR while calculation lock time in days ", error)
    return lockTimeInDays
  }
}

export const getDepositAndWithdrawFees = async (stakingPoolContractAddress) => {
  let depositFeePercentage = 0
  let withdrawFeePercentage = 0
  try {
    if (stakingPoolContractAddress) {
      // const provider = getWeb3PRovider()
      // const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      // const stakingPoolContractInstance = new ethers.Contract(
      //   stakingPoolContractAddress,
      //   stakingPoolContractABI,
      //   provider
      // )
    }
    return {
      depositFeePercentage,
      withdrawFeePercentage
    }
  } catch (error) {
    console.log("ERROR while fetching deposit and withdrawal fee ", error)
    return {
      depositFeePercentage,
      withdrawFeePercentage
    }
  }
}

export const getTotalStakedAmount = async (stakingPoolContractAddress) => {
  let totalStakedAmount = '0'
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      //staking contract details
      const stakingContractAddress = await stakingPoolContractInstance.stakedToken()
      const stakingTokenContractInstance = new ethers.Contract(
        stakingContractAddress,
        erc20TokenABI,
        provider
      )
      const tokenDecimalsResponse = await stakingTokenContractInstance.decimals()
      const decimals = parseInt(tokenDecimalsResponse.toString())

      const balanceResponse = await stakingTokenContractInstance.balanceOf(stakingPoolContractAddress)
      const stakedAmountFormatted = utils.formatUnits(balanceResponse.toString(), decimals)
      totalStakedAmount = stakedAmountFormatted.toString()
    }
    return totalStakedAmount
  } catch (error) {
    console.log("ERROR while calculating total staked amount in the pool ", error)
    return totalStakedAmount
  }
}

export const getStakedTokenDetails = async (stakingPoolContractAddress) => {
  let tokenName = ''
  let tokenSymbol = ''
  let tokenAddress = ''
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      //staking contract details
      const stakingContractAddress = await stakingPoolContractInstance.stakedToken()
      const stakingTokenContractInstance = new ethers.Contract(
        stakingContractAddress,
        erc20TokenABI,
        provider
      )
      tokenAddress = stakingContractAddress
      tokenName = await stakingTokenContractInstance.name()
      tokenSymbol = await stakingTokenContractInstance.symbol()
    }
    return {
      tokenName,
      tokenSymbol,
      tokenAddress
    }
  } catch (error) {
    console.log("ERROR while fetching staked token details in the pool ", error)
    return {
      tokenName,
      tokenSymbol,
      tokenAddress
    }
  }
}

export const getStakingPoolEndBlockNumber = async (stakingPoolContractAddress) => {
  let endingBlockNumber = 0
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const endingBlockResponse = await stakingPoolContractInstance.bonusEndBlock()
      endingBlockNumber = parseInt(endingBlockResponse.toString())
    }
    return endingBlockNumber
  } catch (error) {
    console.log("ERROR while fetching rewards ending block in the pool ", error)
    return endingBlockNumber
  }
}

export const getRewardsTokenDetails = async (stakingPoolContractAddress) => {
  let tokenName = ''
  let tokenSymbol = ''
  let tokenAddress = ''
  try {
    if (stakingPoolContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      //staking contract details
      const rewardsTokenContractAddress = await stakingPoolContractInstance.rewardToken()
      const rewardsTokenContractInstance = new ethers.Contract(
        rewardsTokenContractAddress,
        erc20TokenABI,
        provider
      )
      tokenAddress = rewardsTokenContractAddress
      tokenName = await rewardsTokenContractInstance.name()
      tokenSymbol = await rewardsTokenContractInstance.symbol()
    }
    return {
      tokenName,
      tokenSymbol,
      tokenAddress
    }
  } catch (error) {
    console.log("ERROR while fetching staked token details in the pool ", error)
    return {
      tokenName,
      tokenSymbol,
      tokenAddress
    }
  }
}

export const getUserStakedDetails = async (stakingPoolContractAddress, walletAddress) => {
  let stakedAmount = ''
  let rewardsAmount = ''
  let stakedTimestamp = 0
  try {
    if (stakingPoolContractAddress && walletAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)

      const rewardsTokenContractAddress = await stakingPoolContractInstance.rewardToken()
      const stakedTokenContractAddress = await stakingPoolContractInstance.stakedToken()
      const rewardsTokenContractInstance = new ethers.Contract(
        rewardsTokenContractAddress,
        erc20TokenABI,
        provider
      )
      const stakedTokenContractInstance = new ethers.Contract(
        stakedTokenContractAddress,
        erc20TokenABI,
        provider
      )
      const stakedTokenDecimalsResponse = await stakedTokenContractInstance.decimals()
      const rewardsTokenDecimalsResponse = await rewardsTokenContractInstance.decimals()
      const stakeTokenDecimals = parseInt(stakedTokenDecimalsResponse.toString())
      const rewardsTokenDecimals = parseInt(rewardsTokenDecimalsResponse.toString())


      const userStakingDetails = await stakingPoolContractInstance.userInfo(walletAddress)
      const userStakedAmountResponse = utils.formatUnits(userStakingDetails[0].toString(), stakeTokenDecimals)
      stakedAmount = userStakedAmountResponse.toString()
      const userRewardsTokenAmountResponse = utils.formatUnits(userStakingDetails[1].toString(), rewardsTokenDecimals)
      rewardsAmount = userRewardsTokenAmountResponse.toString()

      const userStakeTimestamp = userStakingDetails[2].toString()
      stakedTimestamp = parseInt(userStakeTimestamp)
    }
    return {
      stakedAmount,
      rewardsAmount,
      stakedTimestamp
    }
  } catch (error) {
    console.log("ERROR while fetching user staked details in the pool ", error)
    return {
      stakedAmount,
      rewardsAmount,
      stakedTimestamp
    }
  }
}

export const approveTokenForStaking = async (
  stakeTokenContractAddress,
  spender,
  tokenAmount,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const stakeTokenContractInstance = new ethers.Contract(
      stakeTokenContractAddress,
      erc20TokenABI,
      provider
    )
    const stakeTokenContractInstanceWithSigner = stakeTokenContractInstance.connect(signer)
    const decimalsResponse = await stakeTokenContractInstanceWithSigner.decimals()
    const decimals = parseInt(decimalsResponse.toString())
    const formattedTokenAmount = utils.parseUnits(tokenAmount.toString(), decimals)
    const approvalReceipt = await stakeTokenContractInstanceWithSigner.approve(spender, formattedTokenAmount)
    const result = await approvalReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying approve tokens for staking'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const stakeTokens = async (
  stakeTokenContractAddress,
  stakingPoolAddress,
  tokenAmount,
  signer
) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const stakeTokenContractInstance = new ethers.Contract(
      stakeTokenContractAddress,
      erc20TokenABI,
      provider
    )
    const stakeTokenContractInstanceWithSigner = stakeTokenContractInstance.connect(signer)
    const decimalsResponse = await stakeTokenContractInstanceWithSigner.decimals()
    const decimals = parseInt(decimalsResponse.toString())
    const formattedTokenAmount = utils.parseUnits(tokenAmount.toString(), decimals)

    const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
    const stakingPoolContractInstance = new ethers.Contract(
      stakingPoolAddress,
      stakingPoolContractABI,
      provider
    )

    const stakingPoolContractInstanceWithSigner = stakingPoolContractInstance.connect(signer)
    const stakingReceipt = await stakingPoolContractInstanceWithSigner.deposit(formattedTokenAmount)
    const result = await stakingReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying stake token'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

export const getMaximumTokenStakingLimit = async (stakingPoolContractAddress, stakeTokenContractAddress) => {
  let maximumStakingLimitPerUser = 0
  try {
    if (stakingPoolContractAddress && stakeTokenContractAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )
      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
      const stakeTokenContractInstance = new ethers.Contract(
        stakeTokenContractAddress,
        erc20TokenABI,
        provider
      )
      const decimalsResponse = await stakeTokenContractInstance.decimals()
      const decimals = parseInt(decimalsResponse.toString())

      const maximumStakingLimitResponse = await stakingPoolContractInstance.poolLimitPerUser()
      const formattedResponse = utils.formatUnits(maximumStakingLimitResponse.toString(), decimals)
      maximumStakingLimitPerUser = formattedResponse.toString()
    }
    return maximumStakingLimitPerUser
  } catch (error) {
    console.log("ERROR while fetching maximum stake token limit ", error)
    return maximumStakingLimitPerUser
  }
}

export const harvestEarning = async (stakingPoolAddress, rewardTokenContractAddress, rewardsAmount, signer) => {

  try {
    const provider = getWeb3PRovider()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const rewardsTokenContractInstance = new ethers.Contract(
      rewardTokenContractAddress,
      erc20TokenABI,
      provider
    )

    const decimalsResponse = await rewardsTokenContractInstance.decimals()
    const decimals = parseInt(decimalsResponse.toString())

    const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
    const stakingPoolContractInstance = new ethers.Contract(
      stakingPoolAddress,
      stakingPoolContractABI,
      provider
    )
    const stakingPoolContractInstanceWithSigner = stakingPoolContractInstance.connect(signer)
    const formattedRewardsAmount = utils.parseUnits(rewardsAmount.toString(), decimals)

    const withdrawReceipt = await stakingPoolContractInstanceWithSigner.withdraw(formattedRewardsAmount)
    const result = await withdrawReceipt.wait()
    return result
  } catch (error) {
    let errorMessage = 'Something went wrong while trying harvest the reward tokens'
    if (error && error.message) {
      errorMessage = error.message
    }
    if (error && error.reason && error.reason !== '') {
      errorMessage = error.reason
    }
    throw errorMessage
  }
}

//staking calculator related logic
// 1 day, 7 days, 30 days, 1 year, 5 years
const DAYS_TO_CALCULATE_AGAINST = [1, 7, 30, 365, 1825]

/**
 *
 * @param principalInUSD - amount user wants to invest in USD
 * @param apr - farm or pool apr as percentage. If its farm APR its only cake rewards APR without LP rewards APR
 * @param earningTokenPrice - price of reward token
 * @param compoundFrequency - how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @param performanceFee - performance fee as percentage
 * @returns an array of token values earned as interest, with each element representing interest earned over a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export const getInterestBreakdown = ({
  principalInUSD,
  apr,
  earningTokenPrice,
  compoundFrequency = 1,
  performanceFee = 0,
}) => {
  // Everything here is worked out relative to a year, with the asset compounding at the compoundFrequency rate. 1 = once per day
  const timesCompounded = 365 * compoundFrequency
  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const aprAsDecimal = apr / 100

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  // and also cause rounding errors
  const isHighValueToken = Math.round(earningTokenPrice / 1000) > 0
  const roundingDecimalsNew = isHighValueToken ? 5 : 3

  return DAYS_TO_CALCULATE_AGAINST.map((days) => {
    const daysAsDecimalOfYear = days / 365
    // Calculate the starting TOKEN balance with a dollar balance of principalInUSD.
    const principal = principalInUSD / earningTokenPrice
    let interestEarned = principal * aprAsDecimal * (days / 365)
    if (timesCompounded !== 0) {
      // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
      const accruedAmount = principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)
      // To get the TOKEN amount earned, deduct the amount after compounding (accruedAmount) from the starting TOKEN balance (principal)
      interestEarned = accruedAmount - principal
      if (performanceFee) {
        const performanceFeeAsDecimal = performanceFee / 100
        const performanceFeeAsAmount = interestEarned * performanceFeeAsDecimal
        interestEarned -= performanceFeeAsAmount
      }
    }
    return parseFloat(interestEarned.toFixed(roundingDecimalsNew))
  })
}

/**
 * @param interest how much USD amount you aim to make
 * @param apr APR of farm/pool
 * @param compoundingFrequency how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @returns an array of principal values needed to reach target interest, with each element representing principal needed for a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export const getPrincipalForInterest = (
  interest,
  apr,
  compoundingFrequency,
  performanceFee = 0,
) => {
  return DAYS_TO_CALCULATE_AGAINST.map((days) => {
    const apyAsDecimal = getApy(apr, compoundingFrequency, days, performanceFee)
    // console.log('inside', interest, apyAsDecimal)
    // const apyAsBN = new BigNumber(apyAsDecimal).decimalPlaces(6, BigNumber.ROUND_DOWN).toNumber()
    return parseFloat((interest / apyAsDecimal).toFixed(2))
  })
}

/**
 * Given APR returns APY
 * @param apr APR as percentage
 * @param compoundFrequency how many compounds per day
 * @param days if other than 365 adjusts (A)PY for period less than a year
 * @param performanceFee performance fee as percentage
 * @returns APY as decimal
 */
export const getApy = (apr, compoundFrequency = 1, days = 365, performanceFee = 0) => {
  const daysAsDecimalOfYear = days / 365
  const aprAsDecimal = apr / 100
  const timesCompounded = 365 * compoundFrequency
  let apyAsDecimal = (apr / 100) * daysAsDecimalOfYear
  if (timesCompounded > 0) {
    apyAsDecimal = (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1
  }
  if (performanceFee) {
    const performanceFeeAsDecimal = performanceFee / 100
    const takenAsPerformanceFee = apyAsDecimal * performanceFeeAsDecimal
    apyAsDecimal -= takenAsPerformanceFee
  }
  return apyAsDecimal
}


/**
 * Get the APR value in %
 * @param stakingPoolContractAddress staking pool contract address
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = async (stakingPoolContractAddress) => {

  let aprPercentage = null
  if (stakingPoolContractAddress) {
    const provider = getWeb3PRovider()
    const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
    const stakingPoolContractInstance = new ethers.Contract(
      stakingPoolContractAddress,
      stakingPoolContractABI,
      provider
    )

    //get staking and rewards tokens addresses
    const rewardsTokenContractAddress = await stakingPoolContractInstance.rewardToken()
    const stakedTokenContractAddress = await stakingPoolContractInstance.stakedToken()
    const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
    const stakeTokenContractInstance = new ethers.Contract(
      stakedTokenContractAddress,
      erc20TokenABI,
      provider
    )

    const rewardsTokenContractInstance = new ethers.Contract(
      rewardsTokenContractAddress,
      erc20TokenABI,
      provider
    )

    const stakingTokenDecimals = await stakeTokenContractInstance.decimals()
    const rewardsTokenDecimals = await rewardsTokenContractInstance.decimals()

    let totalTokenStakedResponse = 0
    if (rewardsTokenContractAddress.toLowerCase() === stakedTokenContractAddress.toLowerCase()) {
      totalTokenStakedResponse = await stakingPoolContractInstance.totalStakedTokens()
    } else {
      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
      const stakeTokenContractInstance = new ethers.Contract(
        stakedTokenContractAddress,
        erc20TokenABI,
        provider
      )
      totalTokenStakedResponse = await stakeTokenContractInstance.balanceOf(stakingPoolContractAddress)
    }

    const BSC_BLOCK_TIME = 3
    const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
    const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000

    //get staking token and rewards token prices
    const stakingTokenPriceInUSD = await getTokenPriceInUSDByTokenAddress(stakedTokenContractAddress)
    const rewardsTokenPriceInUSD = await getTokenPriceInUSDByTokenAddress(rewardsTokenContractAddress)
    const tokensPreBlockResponse = await stakingPoolContractInstance.rewardPerBlock()

    const rewardsTokenPerBlockFormatted = utils.formatUnits(tokensPreBlockResponse.toString(), parseInt(rewardsTokenDecimals))
    const totalStakedTokenFormatted = utils.formatUnits(totalTokenStakedResponse.toString(), parseInt(stakingTokenDecimals))

    if (parseFloat(totalStakedTokenFormatted.toString()) >= 0 && stakingTokenPriceInUSD >= 0) {
      const totalRewardPricePerYear = parseFloat(rewardsTokenPriceInUSD) * parseFloat(rewardsTokenPerBlockFormatted.toString()) * BLOCKS_PER_YEAR
      const totalStakingTokenInPool = parseFloat(stakingTokenPriceInUSD) * parseFloat(totalStakedTokenFormatted.toString())
      const apr = (totalRewardPricePerYear / totalStakingTokenInPool) * 100
      aprPercentage = apr
    } else {

      aprPercentage = 0.0
    }
  } else {
    aprPercentage = 0.0
  }
  return aprPercentage
}

export const getRoi = ({ amountEarned, amountInvested }) => {
  if (amountInvested === 0) {
    return 0
  }
  const percentage = (amountEarned / amountInvested) * 100
  return percentage
}

export const roiCalculatorRewardsTokenDetails = async (stakingPoolContractAddress) => {
  let tokenName = ''
  let tokenSymbol = ''
  let tokenAddress = ''
  let tokenPrice = 0.0
  try {
    if (stakingPoolContractAddress) {
      const response = await getRewardsTokenDetails(stakingPoolContractAddress)
      tokenName = response.tokenName
      tokenSymbol = response.tokenSymbol
      tokenAddress = response.tokenAddress
      //token price
      const tokenPiceResponse = await getTokenPriceInUSDByTokenAddress(tokenAddress)
      tokenPrice = tokenPiceResponse
    }
    return {
      tokenName,
      tokenSymbol,
      tokenAddress,
      tokenPrice
    }
  } catch (error) {
    console.log("ERROR while fetching rewards token details ", error)
    return {
      tokenName,
      tokenSymbol,
      tokenAddress,
      tokenPrice
    }
  }
}

export const getUserStakedRewardsAmount = async (stakingPoolContractAddress, walletAddress) => {
  let rewardsAmount = ''
  try {
    if (stakingPoolContractAddress && walletAddress) {
      const provider = getWeb3PRovider()
      const stakingPoolContractABI = JSON.parse(stakingConfigs.stakingPoolContractABI)
      const stakingPoolContractInstance = new ethers.Contract(
        stakingPoolContractAddress,
        stakingPoolContractABI,
        provider
      )

      const erc20TokenABI = JSON.parse(configs.commonERC20ContractABI)
      const rewardsTokenContractAddress = await stakingPoolContractInstance.rewardToken()

      const rewardsTokenContractInstance = new ethers.Contract(
        rewardsTokenContractAddress,
        erc20TokenABI,
        provider
      )
      const rewardsTokenDecimalsResponse = await rewardsTokenContractInstance.decimals()
      const rewardsTokenDecimals = parseInt(rewardsTokenDecimalsResponse.toString())
      const userRewardsAmountResponse = await stakingPoolContractInstance.pendingReward(walletAddress)
      const userRewardsTokenAmountResponse = utils.formatUnits(userRewardsAmountResponse.toString(), rewardsTokenDecimals)
      rewardsAmount = userRewardsTokenAmountResponse.toString()
    }
    return rewardsAmount
  } catch (error) {
    console.log("ERROR while fetching user rewards amount in the pool ", error)
    return rewardsAmount
  }
}

