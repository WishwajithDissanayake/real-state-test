import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spin, Button } from 'antd'
import NumberFormat from 'react-number-format'
import { CalculatorOutlined } from '@ant-design/icons'

import { useSocket } from '../../../Providers/SocketProvider'

export default function StakingAPRButton(props) {

  const {
    stakingPoolAddress,
    setIsROICalculatorVisible,
    setAprPercentage,
    aprPercentage,
    cachedBlockNumber,
    stakingPoolData
  } = props

  const { t } = useTranslation()
  const socket = useSocket()

  const [isAPRLoading, setIsAPRLoading] = useState(false)

  useEffect(() => {
    if (socket) {
      fetchAPRDataFromSocket()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (stakingPoolAddress) {
      //fetchTheAPR(stakingPoolAddress)
    } else {
      setAprPercentage(0.0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingPoolAddress])


  const fetchAPRDataFromSocket = async () => {
    socket?.emit('calculateAPR', { stakingDetails: stakingPoolData })
    socket?.on('calculatedAPR', (data) => {
      if (data?.stakingPoolAddress === stakingPoolAddress) {
        setAprPercentage(data?.apr)
      }
    })
  }

  return (

    <div className='d-flex justify-content-between'>
      <div className='text-start'>
        {t('APR')}
      </div>

      <div className='text-end' onClick={() => setIsROICalculatorVisible(true)}>
        {
          isAPRLoading ? (
            <Spin size='small' />
          ) : (
            <>
              <Button size="small" className='d-flex pool-button' disabled={cachedBlockNumber === 0}>
                <NumberFormat
                  displayType='text'
                  decimalScale={2}
                  value={aprPercentage ? aprPercentage : 0}
                  suffix="%"
                />
                <div style={{ marginTop: '-3px', marginLeft: '5px' }}>
                  <CalculatorOutlined style={{ color: '#e6bd4f' }} />
                </div>
              </Button>
            </>
          )
        }

      </div>
    </div>

  )
}
