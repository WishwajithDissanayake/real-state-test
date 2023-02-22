import React, { useEffect, useState } from 'react'
import { Row, } from 'reactstrap'
import { Button, notification, Spin } from 'antd'
import { claimAndExitFromPool } from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import useUserPresalePoolDetails from '../../Hooks/useUserPresalePoolDetails'
import axios from 'axios'
import { useTranslation } from 'react-i18next';


export default function ClaimAndExitButton(props) {

  const { t } = useTranslation();
  const {
    isPoolStatusLoading,
    liquidityTokenName,
    poolStatus,
    poolAddress,
    shouldForcedRefresh,
    setShouldForcedRefresh
  } = props

  const [isClaimAndExitLoading, setIsClaimAndExitLoading] = useState(false)
  const [canShowClaimButton, setCanShowClaimButton] = useState(false)

  const { account, library } = useWeb3React()

  const key = 'updatable';

  const { userPresalePoolDetails, isLoading: isUserDetailsLoading } = useUserPresalePoolDetails({
    poolAddress: poolAddress,
    walletAddress: account,
    liquidityTokenName: liquidityTokenName,
    forcedRefresh: shouldForcedRefresh
  })

  useEffect(() => {
    if (!isUserDetailsLoading &&
      !isPoolStatusLoading &&
      parseFloat(userPresalePoolDetails?.myContributionInBNB) > 0 &&
      (poolStatus?.statusCode === 'canceled')) {
      setCanShowClaimButton(true)

    } else {
      setCanShowClaimButton(false)
    }
  }, [
    shouldForcedRefresh,
    poolStatus,
    isUserDetailsLoading,
    isPoolStatusLoading,
    userPresalePoolDetails])

  const handleClaimAndExitPool = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsClaimAndExitLoading(false)
        return
      }

      setIsClaimAndExitLoading(true)
      const response = await claimAndExitFromPool(poolAddress, library.getSigner())

      //save contribution details to the api
      const payload = {
        "poolContractAddress": poolAddress,
        "walletAddress": account
      }

      let config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/contribute`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload)
      };
      const apiResponse = await axios(config)
      console.log("response ", response)
      console.log("apiResponse ", apiResponse)

      setIsClaimAndExitLoading(false)
      setShouldForcedRefresh(true)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully claim your BNB, you are no longer contributor for this pool.'),
      });
    } catch (error) {
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      });
      setIsClaimAndExitLoading(false)
      console.error("ERROR while executing the contribution ", error)
    }
  }


  return (
    <>
      {
        isUserDetailsLoading ? (
          <div className="loader d-flex justify-content-center mt-4">
            <Spin size='small' />
          </div>
        ) : (
          <Row className="mt-2 claim-and-exit">
            <div className='claim-and-exit-button-container'>
              {
                canShowClaimButton ? (
                  <Button
                    loading={isClaimAndExitLoading}
                    onClick={handleClaimAndExitPool}
                    block
                    disabled={isUserDetailsLoading}
                    type="primary">
                    {t('Claim Refund')}
                  </Button>
                ) : (<></>)
              }
            </div>
          </Row>
        )
      }
    </>
  )
}
