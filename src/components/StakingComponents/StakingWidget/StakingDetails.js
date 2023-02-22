import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import NumberFormat from 'react-number-format'
import { getTokenPriceInUSDByTokenAddress } from '../../../Blockchain/services/common.service'

export default function StakingDetails(props) {
  const { poolData, isUserStakedDetailsLoading, userStakedDetails } = props
  const { t } = useTranslation()

  const [isStakedTokenPriceLoading, setIsStakedTokenPriceLoading] = useState(0.0)
  const [stakedTokenPrice, setStakedTokenPrice] = useState(0.0)
  const [totalStakedAmountInUSD, setTotalStakedAmountInUSD] = useState(0.0)

  const fetchStakedTokenPrice = async () => {
    setIsStakedTokenPriceLoading(true)
    try {
      const tokenPrice = await getTokenPriceInUSDByTokenAddress(poolData?.stakingTokenAddress)
      setStakedTokenPrice(tokenPrice)
      setIsStakedTokenPriceLoading(false)
    } catch (error) {
      setStakedTokenPrice(0.0)
      setIsStakedTokenPriceLoading(false)
      console.log("ERROR while staked token price", error)
    }
  }

  useEffect(() => {

    if (userStakedDetails && stakedTokenPrice) {
      const totalAmountInUSD = parseFloat(stakedTokenPrice) * parseFloat(userStakedDetails?.stakedAmount)
      setTotalStakedAmountInUSD(totalAmountInUSD)
    } else {
      setTotalStakedAmountInUSD(0.0)
    }

  }, [stakedTokenPrice, userStakedDetails])

  useEffect(() => {
    if (poolData) {
      fetchStakedTokenPrice()
    } else {
      setStakedTokenPrice(0.0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolData])

  return (
    <div>
      <span className='primary-text small'>
        {poolData?.stakingTokenName} {t('Staked')}
      </span>
      <div className='d-flex justify-content-between small'>
        {
          isUserStakedDetailsLoading ? (
            <div className='d-flex justify-content-start loader'>
              <Spin size='small' />
            </div>
          ) : (
            <NumberFormat
              displayType='text'
              decimalScale={6}
              value={userStakedDetails ? userStakedDetails?.stakedAmount : 0}
              suffix={` ${poolData?.stakingTokenSymbol}`}
            />
          )
        }
      </div>

      <div className='d-flex justify-content-between small'>
        {
          isStakedTokenPriceLoading ? (
            <div className='d-flex justify-content-start loader'>
              <Spin size='small' />
            </div>
          ) : (
            <NumberFormat
              displayType='text'
              decimalScale={6}
              value={totalStakedAmountInUSD ? totalStakedAmountInUSD : 0}
              suffix=" USD"
            />
          )
        }
      </div>
    </div>
  )
}
