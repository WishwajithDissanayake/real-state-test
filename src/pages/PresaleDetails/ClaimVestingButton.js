import React, { useEffect, useState } from 'react'
import { Col, Row, } from 'reactstrap'
import { Button, notification, Spin } from 'antd'
import {
  getUserContributionDetails,
  getPoolVestingStatus,
  claimVestedTokensFromPool
} from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import useUserPresalePoolDetails from '../../Hooks/useUserPresalePoolDetails'
import { useTranslation } from 'react-i18next';
import Countdown from 'react-countdown'
import { DateTime } from 'luxon'
import NumberFormat from 'react-number-format'

export default function ClaimVestingButton(props) {

  const { t } = useTranslation();
  const {
    isPoolStatusLoading,
    poolStatus,
    poolAddress,
    liquidityTokenName,
    shouldForcedRefresh,
    presaleSaleDetails
  } = props

  const [isClaimVestingLoading, setIsClaimVestingLoading] = useState(false)
  const [isVestingEnabled, setIsVestingEnabled] = useState(false)
  const [isVestingButtonDisabled, setIsVestingButtonDisabled] = useState(true)
  const [isUserVestingDetailsLoading, setIsUserVestingDetailsLoading] = useState(false)
  const [userVestingDetails, setUserVestingDetails] = useState(null)
  const [nextClaimTime, setNextClaimTime] = useState(DateTime.now().toSeconds())

  const { account, library } = useWeb3React()

  const { userPresalePoolDetails, isLoading: isUserDetailsLoading } = useUserPresalePoolDetails({
    poolAddress: poolAddress,
    walletAddress: account,
    liquidityTokenName: liquidityTokenName,
    forcedRefresh: shouldForcedRefresh
  })

  const key = 'updatable';

  useEffect(() => {
    if (poolAddress) {
      fetchPoolVestingStatus(poolAddress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress])

  useEffect(() => {
    if (poolAddress) {
      fetchVestingDetailsByUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress, account, liquidityTokenName, shouldForcedRefresh])

  useEffect(() => {
    console.log('userVestingDetails', userVestingDetails);
    if (userVestingDetails) {
      const nextClaimTimestampSeconds = DateTime.fromSeconds(parseInt(userVestingDetails?.nextClaimedTimestamp))
      setNextClaimTime(nextClaimTimestampSeconds)
      if (!userVestingDetails.isClaimed) {
        setIsVestingButtonDisabled(true)
      } else {
        const currentTimestamp = DateTime.now().toSeconds()
        const diff = parseInt(userVestingDetails?.nextClaimedTimestamp) - currentTimestamp
        if (diff >= 0) {
          setIsVestingButtonDisabled(true)
        } else {
          setIsVestingButtonDisabled(false)
        }
      }
    }
  }, [userVestingDetails])

  const fetchPoolVestingStatus = async () => {
    try {
      const vestingResponse = await getPoolVestingStatus(poolAddress)
      setIsVestingEnabled(vestingResponse)
    } catch (error) {
      console.error("ERROR while fetching pool vesting data ", error)
    }
  }

  const fetchVestingDetailsByUser = async () => {
    setIsUserVestingDetailsLoading(true)
    try {
      const userVestingDetailsResponse = await getUserContributionDetails(poolAddress, account, liquidityTokenName)
      setUserVestingDetails(userVestingDetailsResponse)
      setIsUserVestingDetailsLoading(false)
    } catch (error) {
      setUserVestingDetails(null)
      setIsUserVestingDetailsLoading(false)
      console.error("ERROR while fetching pool vesting data ", error)
    }
  }

  const handleClaimVesting = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsClaimVestingLoading(false)
        return
      }

      setIsClaimVestingLoading(true)
      const response = await claimVestedTokensFromPool(poolAddress, library.getSigner())
      console.log("response ", response)
      setIsClaimVestingLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully claim your vesting tokens.'),
      });
    } catch (error) {
      let errorMessage = t('Something went wrong while trying to claim your vested tokens. Please try again')
      if (error && error.reason && error.reason !== '') {
        errorMessage = error.reason
      }
      notification['error']({
        key,
        message: t('Error'),
        description: errorMessage,
      });
      setIsClaimVestingLoading(false)
      console.error("ERROR while executing claim vesting tokens ", error)
    }
  }

  return (
    <>
      {
        isUserDetailsLoading || isUserVestingDetailsLoading ? (
          <div className="loader d-flex justify-content-center mt-4">
            <Spin size='small' />
          </div>
        ) : (
          <div>
            {
              parseFloat(userPresalePoolDetails?.myContributionInBNB) > 0 && isVestingEnabled ? (
                <Row className="mt-2">
                  <Col>
                    {
                      !isPoolStatusLoading &&
                        (poolStatus?.poolStatus === 4) ? (
                        <span>
                          <div className='my-3 d-flex justify-content-center'>
                            <span className='vesting-details-header'>----- Vesting Details -----</span>
                          </div>
                          <div className='d-flex justify-content-between vesting-details'>
                            <span>Next vesting unlock at</span>
                            <Countdown
                              date={nextClaimTime ? nextClaimTime.toString() : DateTime.now().toString()}
                              renderer={props => (
                                <div>
                                  {props.formatted.days}:
                                  {props.formatted.hours}:
                                  {props.formatted.minutes}:
                                  {props.formatted.seconds}
                                </div>
                              )}
                              zeroPadTime={2}
                            />
                          </div>
                          <div className='d-flex justify-content-between vesting-details mb-3'>
                            <span>Remaining vesting balance</span>
                            <NumberFormat
                              displayType='text'
                              decimalScale={4}
                              suffix={` ${presaleSaleDetails?.tokenSymbol}`}
                              thousandSeparator={true}
                              value={userPresalePoolDetails?.remainingClaimableTokenAmount}
                            />
                          </div>

                          <Button
                            loading={isClaimVestingLoading}
                            onClick={handleClaimVesting}
                            block
                            disabled={isVestingButtonDisabled}
                            type="primary">
                            {t('Claim Vested Token')}
                          </Button>
                        </span>
                      ) : (<></>)
                    }
                  </Col>
                </Row>
              ) : (
                <></>
              )
            }
          </div>
        )
      }
    </>
  )
}
