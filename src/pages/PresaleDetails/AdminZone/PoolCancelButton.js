import React, { useState, useEffect } from 'react'
import { Spin, Button, notification } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { cancelPool } from '../../../Blockchain/services/presale.service'
import { useTranslation } from 'react-i18next';


export default function PoolCancelButton(props) {

  const { t } = useTranslation();
  const { isPoolStatusLoading, poolStatus, presaleAddress } = props

  const [canCancelThePool, setCanCancelThePool] = useState(false)
  const [isCancelPoolLoading, setIsCancelPoolLoading] = useState(false)
  const { account, library } = useWeb3React()

  const key = 'updatable';

  useEffect(() => {
    if (poolStatus) {
      if (poolStatus?.statusCode === 'ongoing') {
        setCanCancelThePool(true)
      } else {
        setCanCancelThePool(false)
      }
    }
  }, [poolStatus])

  const handleCancelPool = async () => {
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsCancelPoolLoading(false)
        return
      }

      setIsCancelPoolLoading(true)
      const response = await cancelPool(presaleAddress, library.getSigner())
      console.log("response ", response)
      setIsCancelPoolLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('You have successfully cancel the private pool.'),
      });
    } catch (error) {
      setIsCancelPoolLoading(false)
      console.error("ERROR while cancel  the private sale pool ", error)
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
            loading={isCancelPoolLoading}
            disabled={canCancelThePool}
            onClick={handleCancelPool}
            block
            type="primary">
            Cancel Presale
          </Button>
        )
      }

    </div>
  )
}
