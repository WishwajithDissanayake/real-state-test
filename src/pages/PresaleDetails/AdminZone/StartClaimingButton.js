import React, { useState, useEffect } from 'react'
import { Spin, Button, notification } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { startClaiming } from '../../../Blockchain/services/presale.service'
import { useTranslation } from 'react-i18next';

export default function StartClaimingButton(props) {

  const { t } = useTranslation();
  const { isPoolStatusLoading, poolStatus, presaleAddress } = props
  const [canShowTheButton, setCanShowTheButton] = useState(false)
  const [isStartClaimingLoading, setIsStartClaimingLoading] = useState(false)
  const { account, library } = useWeb3React()
  const key = 'updatable';

  useEffect(() => {
    if (poolStatus) {
      if (poolStatus?.statusCode === 'finalized') {
        setCanShowTheButton(true)
      } else {
        setCanShowTheButton(false)
      }
    }
  }, [poolStatus])

  const handleStartClaiming = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsStartClaimingLoading(false)
        return
      }

      setIsStartClaimingLoading(true)
      const response = await startClaiming(presaleAddress, library.getSigner())
      console.log("response ", response)
      setIsStartClaimingLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully start claiming function.'),
      });
    } catch (error) {
      setIsStartClaimingLoading(false)
      console.error("ERROR while start the claiming", error)
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
          <Button
            loading={isStartClaimingLoading}
            disabled={!canShowTheButton}
            onClick={handleStartClaiming}
            block
            type="primary">
            {t('Start Claiming')}
          </Button>
        )
      }

    </div>
  )
}
