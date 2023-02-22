import React, { useState, useEffect } from 'react'
import LPLockInfo from './LPLockInfo'
import LPLockRecords from './LPLockRecords'
import Disclaimer from '../../Disclaimer'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

function LPLockDetails() {

  const navigate = useNavigate()
  const { t } = useTranslation();

  const { id: pairAddress } = useParams()

  const [isTokenDetailsLoading, setIsTokenDetailsLoading] = useState(false)
  const [tokenDetails, setTokenDetails] = useState(null)

  const fetchLiquidityLockDetailsByTokenAddress = async () => {
    setIsTokenDetailsLoading(true)
    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/get/${pairAddress}`
      const response = await axios.get(endpoint)
      if (response && response.status === 200) {
        const tokenDetailsResponse = response.data.payload
        setTokenDetails(tokenDetailsResponse)
      } else {
        setTokenDetails(null)
      }
      setIsTokenDetailsLoading(false)
    } catch (error) {
      setIsTokenDetailsLoading(false)
      setTokenDetails(null)
      console.error("ERROR while fetching liquidity lock details by token address ", error)
    }
  }

  useEffect(() => {
    if (pairAddress) {
      fetchLiquidityLockDetailsByTokenAddress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairAddress])


  return (
    <div className='mb-5'>
      <div className='mt-5'>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>{t('LP Lock List')}</Breadcrumb.Item>
          <Breadcrumb.Item>{t('LP Lock List Detail')}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className='mt-5'>
        <LPLockInfo
          liquidityTokenDetails={tokenDetails}
          pairAddress={pairAddress}
          isTokenDetailsLoading={isTokenDetailsLoading} />
      </div>

      <div className='mt-5'>
        <LPLockRecords pairAddress={pairAddress} />
      </div>

      {/* <div className='mt-4 mb-5'>
        <Disclaimer />
      </div> */}
    </div>
  )
}

export default LPLockDetails