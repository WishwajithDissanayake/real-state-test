import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, notification, Spin } from 'antd'
import NumberFormat from 'react-number-format'
import { getUserStakedRewardsAmount, harvestEarning } from '../../../Blockchain/services/staking.service'
import { useWeb3React } from '@web3-react/core'
import { getTokenPriceInUSDByTokenAddress } from '../../../Blockchain/services/common.service'

export default function RewardsDetails(props) {

  const {
    poolData,
    isUserStakedDetailsLoading,
    userStakedDetails,
  } = props
  const { t } = useTranslation()
  const { account, library } = useWeb3React()
  const key = 'updatable';

  const [isUserPendingRewardsLoading, setIsUserPendingRewardsLoading] = useState(false)
  const [userStakedRewardsAmount, setUserStakedRewardsAmount] = useState(0.0)
  const [isRewardsTokenPriceLoading, setIsRewardsTokenPriceLoading] = useState(0.0)
  const [rewardsTokenPrice, setRewardsTokenPrice] = useState(0.0)
  const [totalRewardsAmountInUSD, setTotalRewardsAmountInUSD] = useState(0.0)
  const [isHarvestingLoading, setIsHarvestingLoading] = useState(false)

  const fetchUserStakedRewardsAmount = async () => {
    setIsUserPendingRewardsLoading(true)
    try {
      const userPendingRewardsAmount = await getUserStakedRewardsAmount(poolData?.stakingPoolAddress, account)
      setUserStakedRewardsAmount(userPendingRewardsAmount)
      setIsUserPendingRewardsLoading(false)
    } catch (error) {
      setUserStakedRewardsAmount(0.0)
      setIsUserPendingRewardsLoading(false)
      console.log("ERROR while fetching user staked rewards amount ", error)
    }
  }

  const fetchRewardsTokenPrice = async () => {
    setIsRewardsTokenPriceLoading(true)
    try {
      const tokenPrice = await getTokenPriceInUSDByTokenAddress(poolData?.rewardsTokenAddress)
      setRewardsTokenPrice(tokenPrice)
      setIsRewardsTokenPriceLoading(false)
    } catch (error) {
      setRewardsTokenPrice(0.0)
      setIsRewardsTokenPriceLoading(false)
      console.log("ERROR while rewards token price", error)
    }
  }


  const handleHarvesting = async () => {
    setIsHarvestingLoading(true)
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsHarvestingLoading(false)
        return
      }

      if (!poolData?.stakingPoolAddress) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not find required data to proceed'),
        });
        setIsHarvestingLoading(false)
        return
      }

      if (!userStakedDetails?.rewardsAmount) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not find required data to proceed'),
        });
        setIsHarvestingLoading(false)
        return
      }

      if (!poolData?.rewardsTokenAddress) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not find required data to proceed'),
        });
        setIsHarvestingLoading(false)
        return
      }

      const result = await harvestEarning(
        poolData?.stakingPoolAddress,
        poolData?.rewardsTokenAddress,
        0,
        library.getSigner())
      console.log("HARVESTING RESULT ", result)
      setIsHarvestingLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('Rewards has been harvested')
      })
    } catch (error) {
      setIsHarvestingLoading(false)
      console.log("ERROR while trying to harvest earning", error)
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error
      })
    }
  }

  useEffect(() => {
    if (poolData?.stakingPoolAddress && account) {
      fetchUserStakedRewardsAmount()
    } else {
      setUserStakedRewardsAmount(0.0)
    }

    if (poolData?.rewardsTokenAddress) {
      fetchRewardsTokenPrice()
    } else {
      setRewardsTokenPrice(0.0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, poolData?.stakingPoolAddress])

  useEffect(() => {

    if (userStakedRewardsAmount && rewardsTokenPrice) {
      const totalAmountInUSD = parseFloat(rewardsTokenPrice) * parseFloat(userStakedRewardsAmount)
      setTotalRewardsAmountInUSD(totalAmountInUSD)
    } else {
      setTotalRewardsAmountInUSD(0.0)
    }

  }, [rewardsTokenPrice, userStakedRewardsAmount])

  return (
    <div>

      <span className='primary-text small'>
        {poolData?.rewardsTokenName} {t('Earned')}
      </span>

      <div className='d-flex justify-content-between small'>
        {
          isUserPendingRewardsLoading ? (
            <div className='d-flex justify-content-start loader'>
              <Spin size='small' />
            </div>
          ) : (
            <NumberFormat
              displayType='text'
              decimalScale={6}
              value={userStakedRewardsAmount ? userStakedRewardsAmount : 0}
              suffix={` ${poolData?.stakingTokenSymbol}`}
            />
          )
        }
      </div>

      <div className='d-flex justify-content-between small'>
        {
          isRewardsTokenPriceLoading || isUserStakedDetailsLoading ? (
            <div className='d-flex justify-content-start loader'>
              <Spin size='small' />
            </div>
          ) : (
            <NumberFormat
              displayType='text'
              decimalScale={6}
              value={totalRewardsAmountInUSD ? totalRewardsAmountInUSD : 0}
              suffix=" USD"
            />
          )
        }
        <Button
          type="primary"
          loading={isHarvestingLoading}
          disabled={parseFloat(userStakedRewardsAmount) <= 0}
          onClick={handleHarvesting}
          className='pool-button col-4 text-dark'
          size="small"><span className='small'>{t('Harvest')}</span>
        </Button>
      </div>
    </div>
  )
}
