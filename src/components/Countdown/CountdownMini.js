import React, { useState, useEffect } from 'react'
import Countdown from 'react-countdown'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next';

function CountdownMini(props) {
  const { startTime, endTime } = props
  const [currentUTCTime, setCurrentUTCTime] = useState('')
  const [startTimeStampUTC, setStartTimeStampUTC] = useState('')
  const [endTimeStampUTC, setEndTimeStampUTC] = useState('')

  const [utcStartTime, setUtcStartTime] = useState(DateTime.now().toSeconds())
  const [utcEndTime, setUtcEndTime] = useState(DateTime.now().toSeconds())
  const { t } = useTranslation();

  useEffect(() => {
    setStartTimeStampUTC(parseInt(startTime))
    setEndTimeStampUTC(parseInt(endTime))
  }, [startTime, endTime])

  useEffect(() => {

    const dateTimeStartTime = DateTime.fromSeconds(parseInt(startTimeStampUTC))
    const dateTimeEndTime = DateTime.fromSeconds(parseInt(endTimeStampUTC))
    setUtcStartTime(dateTimeStartTime)
    setUtcEndTime(dateTimeEndTime)

  }, [startTimeStampUTC, endTimeStampUTC])

  useEffect(() => {
    const currentTimeStamp = parseInt(DateTime.now().toSeconds())
    setCurrentUTCTime(currentTimeStamp)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      {
        currentUTCTime < startTimeStampUTC ? (
          <>
            {t('Sale Starts In:')}<br />
            <Countdown
              date={utcStartTime ? utcStartTime.toString() : DateTime.now().toString()}
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
          </>
        ) : (<></>)
      }

      {
        currentUTCTime < endTimeStampUTC && currentUTCTime > startTimeStampUTC ? (
          <>
            {t('Sale Ends In:')}<br />

            {
              utcEndTime ? (
                <Countdown
                  date={utcEndTime ? utcEndTime.toString() : DateTime.now().toString()}
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
              ) : (<></>)
            }

          </>
        ) : (<></>)
      }

      {
        currentUTCTime > endTimeStampUTC ? (
          <>
            {t('Sale Ends In:')} <br />
            {t('Ended')}
          </>
        ) : (<></>)
      }
    </div>
  )
}

export default CountdownMini