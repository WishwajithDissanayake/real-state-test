import React, { useEffect, useState } from 'react'
import { Col, Row, } from 'reactstrap'
import { Button, notification, Spin } from 'antd'
import {
  claimTokensFromPool,
  getPoolVestingStatus,
  claimVestedTokensFromPool
} from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import useUserPresalePoolDetails from '../../Hooks/useUserPresalePoolDetails'
import { useTranslation } from 'react-i18next';

export default function ClaimButtons(props) {

  const { t } = useTranslation();
  const {
    isPoolStatusLoading,
    poolStatus,
    poolAddress,
    liquidityTokenName,
    shouldForcedRefresh,
    setShouldForcedRefresh
  } = props

  const [isClaimTokensLoading, setIsClaimTokensLoading] = useState(false)
  const [claimButtonText, setClaimButtonText] = useState('Claim Your Tokens')
  const { account, library } = useWeb3React()

  const { userPresalePoolDetails, isLoading: isUserDetailsLoading } = useUserPresalePoolDetails({
    poolAddress: poolAddress,
    walletAddress: account,
    liquidityTokenName: liquidityTokenName,
    forcedRefresh: shouldForcedRefresh
  })

  const key = 'updatable';

  useEffect(() => {
    if (userPresalePoolDetails && userPresalePoolDetails.isClaimed) {
      setClaimButtonText(t('Claimed'))
    } else {
      setClaimButtonText(t('Claim Your Tokens'))
    }
  }, [userPresalePoolDetails, t])

  const handleClaimTokens = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsClaimTokensLoading(false)
        return
      }

      setIsClaimTokensLoading(true)
      const response = await claimTokensFromPool(poolAddress, library.getSigner())
      console.log("response ", response)
      setIsClaimTokensLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully claim your tokens.'),
      })
      setShouldForcedRefresh(true)
    } catch (error) {
      setIsClaimTokensLoading(false)
      notification['error']({
        key,
        message: t('Error Occurred'),
        description: error,
      })
      setShouldForcedRefresh(true)
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
          <div>
            {
              <Row className="mt-2">
                <Col>
                  {
                    !isPoolStatusLoading &&
                      (poolStatus?.poolStatus === 4) ? (
                      <Button
                        loading={isClaimTokensLoading}
                        onClick={handleClaimTokens}
                        block
                        disabled={isPoolStatusLoading || userPresalePoolDetails.isClaimed || parseFloat(userPresalePoolDetails?.myContributionInBNB) <= 0}
                        type="primary">
                        {claimButtonText}
                      </Button>
                    ) : (<></>)
                  }
                </Col>
              </Row>

            }

          </div>
        )
      }
    </>
  )
}
