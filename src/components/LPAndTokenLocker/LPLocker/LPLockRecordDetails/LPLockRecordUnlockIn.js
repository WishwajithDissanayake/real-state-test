import { Card, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import Countdown from 'react-countdown'
import { DateTime } from 'luxon'

function LPLockRecordUnlockIn(props) {

  const { liquidityLockDetailsOnChain, isLiquidityDataLoading, liquidityLockRecordData } = props
  const [unlockTime, setUnlockTime] = useState(DateTime.now())

  useEffect(() => {
    if (liquidityLockDetailsOnChain && liquidityLockRecordData) {
      const unlockTimestamp = DateTime.fromSeconds(parseInt(liquidityLockRecordData?.unlockTimestamp))
      setUnlockTime(unlockTimestamp)
    } else {
      setUnlockTime(DateTime.now())
    }

  }, [liquidityLockDetailsOnChain, liquidityLockRecordData])


  return (
    <div className='text-center'>
      <Card className='kingsale-card-bg'>
        <h6 className='mb-4'>Unlock In</h6>
        {
          isLiquidityDataLoading ? (
            <div className='d-flex justify-content-center loader'>
              <Spin size='medium' />
            </div>
          ) : (
            <div className='countdown-timer'>
              <Countdown date={unlockTime.toString()} key={unlockTime.toString()}
                renderer={props => (
                  <div>
                    <span className='cd-digit-cell'>
                      {props.formatted.days}
                    </span>
                    :
                    <span className='cd-digit-cell'>
                      {props.formatted.hours}
                    </span>
                    :
                    <span className='cd-digit-cell'>
                      {props.formatted.minutes}
                    </span>
                    :
                    <span className='cd-digit-cell'>
                      {props.formatted.seconds}
                    </span>
                  </div>
                )}
                zeroPadTime={2}
              />
            </div>
          )
        }

      </Card>
    </div>
  )
}

export default LPLockRecordUnlockIn