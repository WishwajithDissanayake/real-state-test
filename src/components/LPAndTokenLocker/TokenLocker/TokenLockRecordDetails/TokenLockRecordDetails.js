import React, { useEffect, useState } from 'react'
import TokenLockRecordUnlockIn from './TokenLockRecordUnlockIn'
import TokenLockRecordTokenInfo from './TokenLockRecordTokenInfo'
import TokenLockRecordLockInfo from './TokenLockRecordLockInfo'
import Disclaimer from '../../Disclaimer'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import axios from 'axios'
import {
    getTokenLockDetailsForWithVestingLocksById,
    getTokenLockDetailsForNonVestingLocksById
} from '../../../../Blockchain/services/tokenLock.service'
import { useTranslation } from 'react-i18next';

function TokenLockRecordDetails() {

    const navigate = useNavigate()
    const { id: txHash } = useParams()

    const [tokenLockRecordData, setTokenLockRecordData] = useState(null)
    const [tokenLockDetailsOnChain, setTokenLockDetailsOnChain] = useState(null)
    // const [isVestingEnabled, setIsVestingEnabled] = useState(false)
    const [isTokenDataLoading, setIsTokenDataLoading] = useState(false)
    const { t } = useTranslation();

    const fetchAllTokenDetails = async () => {
        try {
            setIsTokenDataLoading(true)
            const tokenDetailApiResponse = await fetchTokenLockRecordByTxHash()
            await fetchTokenLockedDetailsByLockerId(tokenDetailApiResponse)
            setIsTokenDataLoading(false)
        } catch (error) {
            setIsTokenDataLoading(false)
            console.error("ERROR while fetching token details ", error)
        }
    }

    const fetchTokenLockedDetailsByLockerId = async (tokenDetails) => {
        try {

            if (tokenDetails && tokenDetails.initialVestingReleaseDate) {
                // setIsVestingEnabled(true)
                const vestingResponse = await getTokenLockDetailsForWithVestingLocksById(tokenDetails.tokenLockId)
                setTokenLockDetailsOnChain(vestingResponse)
            } else {
                const response = await getTokenLockDetailsForNonVestingLocksById(tokenDetails.tokenLockId)
                setTokenLockDetailsOnChain(response)
                // setIsVestingEnabled(false)
            }
        } catch (error) {
            setTokenLockDetailsOnChain(null)
            console.error("ERROR while fetching lock details on chain", error)
        }
    }

    const fetchTokenLockRecordByTxHash = async () => {
        let payload = null
        try {

            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/lock-record/${txHash}`
            const apiResponse = await axios.get(endpoint)
            if (apiResponse.status === 200) {
                payload = apiResponse.data.payload
                setTokenLockRecordData(payload)
            } else {
                setTokenLockRecordData(null)
            }

            return payload
        } catch (error) {
            setTokenLockRecordData(null)
            console.error("ERROR while fetching token lock record from API ", error)
            return payload

        }
    }
    useEffect(() => {
        if (txHash) {
            fetchAllTokenDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txHash])

    return (
        <div className='mb-5'>
            <div className='mt-5'>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(-2)} style={{ cursor: 'pointer' }}>{t('Token Lock List')}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>{t('Token Lock List Detail')}</Breadcrumb.Item>
                    <Breadcrumb.Item>{t('Token Lock List Record Detail')}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className='mt-5'>
                <TokenLockRecordUnlockIn
                    tokenLockDetailsOnChain={tokenLockDetailsOnChain}
                    isTokenDataLoading={isTokenDataLoading}
                    tokenLockRecordData={tokenLockRecordData}
                />
            </div>

            <div className='mt-5'>
                <TokenLockRecordTokenInfo
                    isTokenDataLoading={isTokenDataLoading}
                    tokenLockDetailsOnChain={tokenLockDetailsOnChain}
                />
            </div>

            <div className='mt-5'>
                <TokenLockRecordLockInfo
                    tokenLockRecordData={tokenLockRecordData}
                />
            </div>

            {/* <div className='mt-4 mb-5'>
                <Disclaimer />
            </div> */}
        </div>
    )
}

export default TokenLockRecordDetails