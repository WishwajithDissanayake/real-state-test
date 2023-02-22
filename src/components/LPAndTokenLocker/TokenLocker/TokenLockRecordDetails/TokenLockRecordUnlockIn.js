import { Card, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next';

function TokenLockRecordUnlockIn(props) {

  const {
    isTokenDataLoading,
    tokenLockDetailsOnChain } = props
  const [unlockTime, setUnlockTime] = useState(DateTime.now())
  const { t } = useTranslation();


  useEffect(() => {
    if (tokenLockDetailsOnChain) {
      const unlockTimestamp = DateTime.fromSeconds(parseInt(tokenLockDetailsOnChain.unlockDateTimestamp))
      setUnlockTime(unlockTimestamp)
    } else {
      setUnlockTime(DateTime.now())
    }

  }, [tokenLockDetailsOnChain])


  return (
    <div className='text-center'>
      <Card className='kingsale-card-bg'>
        <h6 className='mb-4'>{t('Unlock In')}</h6>

        {
          isTokenDataLoading ? (
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

export default TokenLockRecordUnlockIn