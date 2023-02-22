import React, { useState, useEffect } from 'react'
import Countdown from 'react-countdown'
import './CountDown.css'
import { DateTime } from 'luxon'
function CountDownLarge(props) {
  const { startTime } = props
  const [utcStartTime, setUtcStartTime] = useState(DateTime.now())

  useEffect(() => {
    const dateTimeStartTime = DateTime.fromSeconds(parseInt(startTime))
    setUtcStartTime(dateTimeStartTime)
  }, [startTime])

  return (
    <div>
      <Countdown
        key={utcStartTime.toString()}
        date={utcStartTime.toString()}
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

export default CountDownLarge