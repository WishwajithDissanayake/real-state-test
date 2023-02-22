import React from 'react'
import { Progress, Spin } from 'antd'
import usePoolProgressDetails from '../../Hooks/usePoolProgressDetails'
import NumberFormat from 'react-number-format'
import { utils } from 'ethers'
import { useSelector } from 'react-redux'

function ProgressBarMini(props) {
  const { poolAddress, poolDetails, status } = props
  const {
    isLoading: isPoolProgressDetailsLoading,
    poolProgressDetails
  } = usePoolProgressDetails({ poolAddress })
  const { theme } = useSelector((state) => state.themeState)

  return (
    <div>

      {
        isPoolProgressDetailsLoading ? (
          <div className='text-center'>
            <Spin size="small" />
          </div>
        ) : (
          <div className='mini-progress-bar-container'>
            <div className='progress-info'>
              <span style={{ fontSize: '10px', fontWeight: '700' }}>
                <NumberFormat
                  value={poolProgressDetails ? poolProgressDetails.bnbFilledSoFar : 0.0}
                  displayType={'text'}
                  decimalScale={4}
                  suffix="/"
                /> <NumberFormat
                  value={poolDetails ? utils.formatEther(poolDetails.hardCap) : 0.0}
                  displayType={'text'}
                  decimalScale={4}
                />
              </span>
            </div>
            <div className='progress-bar-mini'>
              <Progress
                percent={poolProgressDetails ? poolProgressDetails.progressPercentage : 0.0}
                status={status}
                showInfo={false}
                strokeWidth={12}
                strokeColor="#e6bd4f"
                trailColor={ theme === 'light' ? "#d9d9d9" : "#1f1f1f"}
              />
            </div>
          </div>
        )
      }
    </div >
  )
}

export default ProgressBarMini