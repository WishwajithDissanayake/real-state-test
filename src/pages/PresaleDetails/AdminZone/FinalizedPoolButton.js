import React, { useState, useEffect } from 'react'
import { Spin, Button, notification, Alert } from 'antd'
import { useWeb3React } from '@web3-react/core'
import {
  getPoolFinalizedStatus,
  finalizedPool,
  finalizedPoolForBEP20Tokens
} from '../../../Blockchain/services/presale.service'
import { useTranslation } from 'react-i18next';

export default function FinalizedPoolButton(props) {

  const { t } = useTranslation();
  const { isPoolStatusLoading, poolStatus, presaleAddress, presaleSaleDetails } = props

  const [canFinalizedThePool, setCanFinalizedThePool] = useState(false)
  const [isFinalizedPoolLoading, setIsFinalizedPoolLoading] = useState(false)
  const [isPoolFinalized, setIsPoolFinalized] = useState(false)
  const [poolButtonText, setPoolButtonText] = useState('Finalize Presale')
  const { account, library } = useWeb3React()

  const key = 'updatable';

  useEffect(() => {
    if (poolStatus) {
      if (poolStatus?.statusCode === 'ended' || poolStatus?.statusCode === 'filled') {
        setCanFinalizedThePool(true)
      } else {
        setCanFinalizedThePool(false)
      }
    } else {
      setCanFinalizedThePool(false)
    }
  }, [poolStatus])

  useEffect(() => {
    if (presaleAddress) {
      fetchPoolFinalizeStatus()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presaleAddress])

  const fetchPoolFinalizeStatus = async () => {
    try {
      const poolFinalizedResponse = await getPoolFinalizedStatus(presaleAddress)
      if (poolFinalizedResponse && poolFinalizedResponse.isPoolFinalized) {
        setIsPoolFinalized(true)
        setPoolButtonText(t('Pool has been finalized'))
      } else {
        setIsPoolFinalized(false)
        setPoolButtonText('Finalize Presale')
      }
    } catch (error) {
      console.error("ERROR while fetching pool finalize status ", error)
      setIsPoolFinalized(false)
    }
  }

  const handleFinalizedPool = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsFinalizedPoolLoading(false)
        return
      }

      setIsFinalizedPoolLoading(true)
      let response
      if (presaleSaleDetails?.liquidityTokenName === 'BNB') {
        response = await finalizedPool(presaleAddress, library.getSigner())
      } else {
        response = await finalizedPoolForBEP20Tokens(presaleAddress, library.getSigner())
      }

      console.log("response ", response)
      setIsFinalizedPoolLoading(false)
      await fetchPoolFinalizeStatus()
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully finalized the private pool.'),
      });
    } catch (error) {
      setIsFinalizedPoolLoading(false)
      console.error("ERROR while finalizing  the private sale pool ", error)
      notification['error']({
        key,
        message: t('Transaction execution failed'),
        description: error,
      });

    }
  }

  return (
    <div className='finalized-pool-button-container'>

      {
        isPoolStatusLoading ? (
          <div className='loader text-centered'>
            <Spin size='small' />
          </div>
        ) : (
          <>
            <Alert message="Please remember to exclude the presale address from the fees." type="info" className='text-center' />
            <Button
              className='mt-2'
              loading={isFinalizedPoolLoading}
              disabled={!canFinalizedThePool || isPoolFinalized}
              onClick={handleFinalizedPool}
              block
              type="primary">
              {poolButtonText}
            </Button>
          </>
        )
      }

    </div>
  )
}
