import React, { useState, useEffect } from 'react'
import { Row, } from 'reactstrap'
import { Button, notification, Input } from 'antd'
import {
  contributeToPrivateSale,
  contributeToPrivateSaleWithCustomCurrency,
  approveCustomCurrencyToken
} from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import { utils } from 'ethers'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import usePoolProgressDetails from '../../Hooks/usePoolProgressDetails'

export default function BuyWithBNBWidget(props) {

  const { t } = useTranslation();

  const key = 'updatable';

  const {
    minContributionAmount,
    isPoolStatusLoading,
    maxContributionAmount,
    poolStatus,
    isPoolDataLoading,
    poolAddress,
    setShouldForcedRefresh,
    presaleSaleDetails
  } = props


  const [contributionAmountInBNB, setContributionAmountInBNB] = useState('')
  const [isContributionLoading, setIsContributionLoading] = useState(false)
  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true)
  const [isApproveCustomCurrencyLoading, setIsApproveCustomCurrencyLoading] = useState(false)
  const [isBuyWithCustomCurrencyButtonDisabled, setIsBuyWithCustomCurrencyButtonDisabled] = useState(true)
  const [isBuyButtonVisible, setIsBuyButtonVisible] = useState(false)

  const { account, library } = useWeb3React()

  const { poolProgressDetails } = usePoolProgressDetails({ poolAddress })

  useEffect(() => {
    //TODO: remove min contribution add correct constrain if min fill amount less than min buy then remove it
    const poolHardCap = parseFloat(poolProgressDetails?.hardCap)
    const bnbFilledSoFar = parseFloat(poolProgressDetails?.bnbFilledSoFar)
    const minContribution = parseFloat(minContributionAmount)
    const remainingBNBToFilled = poolHardCap - bnbFilledSoFar
    let canProceed = false
    if (remainingBNBToFilled < minContribution) {
      canProceed = true
    } else {
      if (parseFloat(contributionAmountInBNB) < minContribution) {
        canProceed = false
      } else {
        canProceed = true
      }
    }

    if (!isPoolDataLoading && !isPoolStatusLoading && contributionAmountInBNB > 0 && canProceed && poolStatus?.statusCode === 'live') {
      setIsBuyButtonDisabled(false)
    } else {
      setIsBuyButtonDisabled(true)
    }
  }, [isPoolDataLoading, isPoolStatusLoading, contributionAmountInBNB, minContributionAmount, poolProgressDetails, poolStatus])

  const handleBuyAmount = (e) => {
    const value = e.target.value
    if (value) {
      if (parseFloat(value) > parseFloat(maxContributionAmount)) {
        setContributionAmountInBNB(maxContributionAmount)
      } else {
        setContributionAmountInBNB(value)
      }
    } else {
      setContributionAmountInBNB('')
    }
  }
  const handleMaxInput = () => {
    setContributionAmountInBNB(maxContributionAmount)
  }
  const handleContributionPayment = async () => {
    try {
      setIsBuyButtonVisible(true)
      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsContributionLoading(false)
        return
      }

      setIsContributionLoading(true)
      const contributionAmountInWei = utils.parseEther(contributionAmountInBNB.toString())
      const response = await contributeToPrivateSale(poolAddress, contributionAmountInWei, library.getSigner())

      //save contribution details to the api
      const payload = {
        "poolContractAddress": poolAddress,
        "contributedAmountInWei": contributionAmountInWei ? contributionAmountInWei.toString() : "0.00",
        "walletAddress": account
      }
      let config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/contribute`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload)
      };

      const apiResponse = await axios(config)
      console.log("response ", response)
      console.log("apiResponse ", apiResponse)

      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully contributed to private pool.'),
      })
      setIsContributionLoading(false)
      setContributionAmountInBNB('')
      setShouldForcedRefresh(true)
      setIsBuyButtonVisible(false)
    } catch (error) {
      setIsContributionLoading(false)
      setContributionAmountInBNB('')
      setIsBuyButtonVisible(true)
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      });

    }
  }

  const handleCustomCurrencyContributionPayment = async () => {
    try {
      setIsBuyButtonVisible(true)
      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsContributionLoading(false)
        return
      }
      if (!contributionAmountInBNB || contributionAmountInBNB === 0) {
        notification['error']({
          key,
          message: t('Input Validation Error'),
          description:
            t('Please enter the correct amount to proceed'),
        });
        setIsContributionLoading(false)
        return
      }
      setIsContributionLoading(true)
      const contributionAmountInWei = utils.parseEther(contributionAmountInBNB.toString())
      const response = await contributeToPrivateSaleWithCustomCurrency(poolAddress, contributionAmountInWei, library.getSigner())

      //save contribution details to the api
      const payload = {
        "poolContractAddress": poolAddress,
        "contributedAmountInWei": contributionAmountInWei ? contributionAmountInWei.toString() : "0.00",
        "walletAddress": account
      }
      let config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/contribute`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload)
      };

      const apiResponse = await axios(config)
      console.log("response ", response)
      console.log("apiResponse ", apiResponse)

      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully contributed to private pool.'),
      })
      setIsContributionLoading(false)
      setContributionAmountInBNB('')
      setShouldForcedRefresh(true)
      setIsBuyButtonVisible(false)
    } catch (error) {
      console.log("BUY ERROR ", error)
      setIsContributionLoading(false)
      setContributionAmountInBNB('')
      setIsBuyButtonVisible(true)
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      });

    }
  }



  const handleApproveCustomCurrency = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsApproveCustomCurrencyLoading(false)
        return
      }

      console.log(presaleSaleDetails)

      setIsApproveCustomCurrencyLoading(true)
      const contributionAmountInWei = utils.parseEther(contributionAmountInBNB.toString())
      await approveCustomCurrencyToken(poolAddress, presaleSaleDetails?.liquidityTokenAddress, contributionAmountInWei, library.getSigner())

      setIsApproveCustomCurrencyLoading(false)
      setIsBuyWithCustomCurrencyButtonDisabled(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('Token has been approved.'),
      });
    } catch (error) {
      setIsApproveCustomCurrencyLoading(false)
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      });

    }
  }

  return (
    <>
      {
        (poolStatus && poolStatus.canContribute) || isBuyButtonVisible ? (
          <>
            <Row className="mt-2">
              <span className='input-label'>
                {t('Amount')} ( {t('min:')} {minContributionAmount} ~ {t('max:')} {maxContributionAmount} {presaleSaleDetails?.liquidityTokenName})
              </span>
              <Input.Group compact style={{
                padding: '0 0 0 10px'
              }}>
                < Input
                  style={{
                    width: 'calc(100% - 70px)',
                  }}
                  disabled={isPoolDataLoading || isPoolStatusLoading ? true : false}
                  value={isPoolDataLoading || isPoolStatusLoading ? 'Please wait' : contributionAmountInBNB}
                  onChange={handleBuyAmount}
                  placeholder="0.0"
                />
                <Button
                  disabled={isPoolDataLoading || isPoolStatusLoading ? true : false}
                  onClick={handleMaxInput}
                  type="primary">{t('max')}
                </Button>
              </Input.Group>
            </Row>

            {
              presaleSaleDetails?.liquidityTokenName !== "BNB" ? (
                <Row className="mt-2">
                  <div className='contribution-button-container'>
                    <Button
                      style={{ marginRight: '5px' }}
                      loading={isApproveCustomCurrencyLoading}
                      onClick={handleApproveCustomCurrency}
                      disabled={isBuyButtonDisabled}
                      type="primary">
                      {t('Approve')} {presaleSaleDetails?.liquidityTokenName}
                    </Button>
                    <Button
                      loading={isContributionLoading}
                      onClick={handleCustomCurrencyContributionPayment}
                      disabled={isBuyWithCustomCurrencyButtonDisabled || poolStatus.statusCode !== 'live'}
                      type="primary">
                      {t('Buy with')} {presaleSaleDetails?.liquidityTokenName}
                    </Button>
                  </div>
                </Row>
              ) : (
                <Row className="mt-2">
                  <div className='contribution-button-container'>
                    <Button
                      loading={isContributionLoading}
                      onClick={handleContributionPayment}
                      disabled={isBuyButtonDisabled}
                      type="primary">
                      Contribute BNB
                    </Button>
                  </div>
                </Row>
              )
            }

          </>
        ) : (
          <></>
        )
      }
    </>
  )
}
