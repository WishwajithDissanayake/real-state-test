import React, { useState, useEffect } from 'react'
import TokenLockInfo from './TokenLockInfo'
import TokenLockRecords from './TokenLockRecords'
import Disclaimer from '../../Disclaimer'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

function TokenLockDetails() {

  const navigate = useNavigate()

  const { id } = useParams()

  const [isTokenDetailsLoading, setIsTokenDetailsLoading] = useState(false)
  const [tokenDetails, setTokenDetails] = useState(null)
  const { t } = useTranslation();

  const fetchTokenLockDetailsByTokenAddress = async () => {
    setIsTokenDetailsLoading(true)
    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/get/${id}`
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
      console.error("ERROR while fetching token lock details by token address ", error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTokenLockDetailsByTokenAddress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])


  return (
    <div className='mb-5'>
      <div className='mt-5'>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>{t('Token Lock List')}</Breadcrumb.Item>
          <Breadcrumb.Item>{t('Token Lock List Detail')}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className='mt-5'>
        <TokenLockInfo
          isTokenDetailsLoading={isTokenDetailsLoading}
          tokenAddress={id}
          tokenDetails={tokenDetails} />
      </div>

      <div className='mt-5'>
        <TokenLockRecords
          isTokenDetailsLoading={isTokenDetailsLoading}
          tokenAddress={id} />
      </div>

      {/* <div className='mt-4 mb-5'>
        <Disclaimer />
      </div> */}
    </div>
  )
}

export default TokenLockDetails