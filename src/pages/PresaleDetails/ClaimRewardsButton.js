import React, { useEffect, useState } from 'react'
import { Row, } from 'reactstrap'
import { Button, notification, Spin } from 'antd'
import {
  claimRewardsTokensFromPool
} from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next';
import useUserPresalePoolDetails from '../../Hooks/useUserPresalePoolDetails'


export default function ClaimRewardsButton(props) {

  console.log("NIPPA props", props)
  const { t } = useTranslation();
  const {
    isPoolStatusLoading,
    poolStatus,
    poolAddress,
    liquidityTokenName,
    shouldForcedRefresh
  } = props

  const [isClaimRewardsTokenLoading, setIsClaimRewardsTokenLoading] = useState(false)
  const { account, library } = useWeb3React()

  const { userPresalePoolDetails, isLoading: isUserDetailsLoading } = useUserPresalePoolDetails({
    poolAddress: poolAddress,
    walletAddress: account,
    liquidityTokenName: liquidityTokenName,
    forcedRefresh: shouldForcedRefresh
  })

  const key = 'updatable';

  const handleClaimRewards = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsClaimRewardsTokenLoading(false)
        return
      }

      setIsClaimRewardsTokenLoading(true)
      const response = await claimRewardsTokensFromPool(poolAddress, library.getSigner())
      console.log("response ", response)
      setIsClaimRewardsTokenLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully claim your rewards tokens.'),
      });
    } catch (error) {
      setIsClaimRewardsTokenLoading(false)
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      });
    }
  }



  return (
    <>
      <div className='claim-btn-container'>
        <div className='claim-token-btn'>
          {
            true ? (
              <Row className="mt-2 claim-rewards-tokens">
                {
                  !isPoolStatusLoading &&
                    (poolStatus?.poolStatus === 4) ? (
                    <Button
                      loading={isClaimRewardsTokenLoading}
                      onClick={handleClaimRewards}
                      block
                      disabled={parseFloat(userPresalePoolDetails?.myContributionInBNB) <= 0 || isUserDetailsLoading}
                      type="primary">
                      {t('Claim Your Rewards Tokens')}
                    </Button>
                  ) : (<></>)
                }

              </Row>
            ) : (<></>)
          }
        </div>

      </div>
    </>
  )
}
