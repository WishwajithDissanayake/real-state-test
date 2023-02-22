import { Card, Spin } from 'antd'
import React from 'react'

function LPLockRecordTokenInfo(props) {

  const { isLiquidityDataLoading, liquidityLockDetailsOnChain, liquidityLockRecordData, tokenLockerDetailsData } = props
console.log('liquidityLockRecordData', liquidityLockRecordData);
  return (
    <div>
      <Card title="Pair Info" className='kingsale-card-bg'>

        {
          isLiquidityDataLoading ? (<div className='d-flex justify-content-center loader'>
            <Spin size='medium' />
          </div>) : (
            <div>
              <div className='d-md-flex justify-content-between'>
                <div>
                  <span>Pair Address</span>
                </div>

                <div>
                  <a
                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${liquidityLockRecordData?.tokenAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className='break-text'
                  >
                    {liquidityLockRecordData?.tokenAddress}
                  </a>
                </div>
              </div>
              <hr />

              <div className='d-md-flex justify-content-between'>
                <div>
                  <span>Pair Name</span>
                </div>

                <div>
                  <span>
                    {liquidityLockRecordData?.tokenAddressOneSymbol} / {liquidityLockRecordData?.tokenAddressTwoSymbol}
                  </span>
                </div>
              </div>
              <hr />

              <div className='d-md-flex justify-content-between'>
                <div>
                  <span>Token</span>
                </div>

                <div>
                  <a
                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${liquidityLockRecordData?.tokenAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className='break-text'
                  >
                    {liquidityLockRecordData?.tokenAddressOneName} - {liquidityLockRecordData?.tokenAddressOneSymbol}
                  </a>
                </div>
              </div>
              <hr />

              <div className='d-md-flex justify-content-between'>
                <div>
                  <span>Quote Token</span>
                </div>

                <div>
                  <a
                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${liquidityLockRecordData?.tokenAddressTwo}`}
                    target="_blank"
                    rel="noreferrer"
                    className='break-text'
                  >
                    {liquidityLockRecordData?.tokenAddressTwoName} - {liquidityLockRecordData?.tokenAddressTwoSymbol}
                  </a>
                </div>
              </div>
              <hr />

              <div className='d-md-flex justify-content-between'>
                <div>
                  <span>Dex Platform</span>
                </div>

                <div>
                  <a
                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${liquidityLockRecordData?.tokenAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className='break-text'
                  >
                    {
                      liquidityLockRecordData?.tokenLock ? liquidityLockRecordData?.tokenLock?.dexPlatform : '~'
                    }
                  </a>
                </div>
              </div>
              <hr />
            </div>
          )
        }

      </Card>
    </div>
  )
}

export default LPLockRecordTokenInfo

