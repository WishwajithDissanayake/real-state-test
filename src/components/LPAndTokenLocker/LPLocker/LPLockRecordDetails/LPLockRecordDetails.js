import React, { useState, useEffect } from 'react'
import LPLockRecordUnlockIn from './LPLockRecordUnlockIn'
import LPLockRecordPairInfo from './LPLockRecordPairInfo'
import LPLockRecordLockInfo from './LPLockRecordLockInfo'
import Disclaimer from '../../Disclaimer'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import axios from 'axios'
import {
    getTokenLockDetailsForWithVestingLocksById,
    getTokenLockDetailsForNonVestingLocksById,
    getTokenLockerDetails
} from '../../../../Blockchain/services/tokenLock.service'


function LPLockRecordDetails() {

    const navigate = useNavigate()
    const { id: txHash } = useParams()

    const [liquidityLockRecordData, setLiquidityLockRecordData] = useState(null)
    const [liquidityLockDetailsOnChain, setLiquidityLockDetailsOnChain] = useState(null)
    const [isLiquidityDataLoading, setIsLiquidityDataLoading] = useState(false)
    const [tokenLockerDetailsLoading, setTokenLockerDetailsLoading] = useState(false)
    const [tokenLockerDetailsData, setTokenLockerDetailsData] = useState(null)
    const [tokenLockId, setTokenLockId] = useState(null)

    const fetchAllTokenDetails = async () => {
        try {
            setIsLiquidityDataLoading(true)
            const tokenDetailApiResponse = await fetchLiquidityLockRecordByTxHash()
            await fetchTokenLockedDetailsByLockerId(tokenDetailApiResponse)
            setTokenLockId(tokenDetailApiResponse.tokenLockId)
            setIsLiquidityDataLoading(false)
        } catch (error) {
            setIsLiquidityDataLoading(false)
            console.error("ERROR while fetching liquidity details ", error)
        }
    }

    const fetchTokenLockedDetailsByLockerId = async (tokenDetails) => {
        try {

            if (tokenDetails && tokenDetails.initialVestingReleaseDate) {
                // setIsVestingEnabled(true)
                const vestingResponse = await getTokenLockDetailsForWithVestingLocksById(tokenDetails.tokenLockId)
                setLiquidityLockDetailsOnChain(vestingResponse)
            } else {
                const response = await getTokenLockDetailsForNonVestingLocksById(tokenDetails.tokenLockId)
                setLiquidityLockDetailsOnChain(response)
                // setIsVestingEnabled(false)
            }
        } catch (error) {
            setLiquidityLockDetailsOnChain(null)
            console.error("ERROR while fetching liquidity lock details on chain", error)
        }
    }

    const fetchLiquidityLockRecordByTxHash = async () => {
        let payload = null
        try {

            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/lock-record/${txHash}`
            const apiResponse = await axios.get(endpoint)
            if (apiResponse.status === 200) {
                payload = apiResponse.data.payload
                setLiquidityLockRecordData(payload)
            } else {
                setLiquidityLockRecordData(null)
            }

            return payload
        } catch (error) {
            setLiquidityLockRecordData(null)
            console.error("ERROR while fetching liquidity lock record from API ", error)
            return payload

        }
    }

    const fetchTokenLockerDetails = async (id) => {
        try {
            setTokenLockerDetailsLoading(true)
            const lockerDetailResponse = await getTokenLockerDetails(id)
            setTokenLockerDetailsData(lockerDetailResponse)
            setTokenLockerDetailsLoading(false)
        } catch (error) {
            console.log(error);
            setTokenLockerDetailsLoading(false)
        }
    }

    useEffect(() => {
        if (txHash) {
            fetchAllTokenDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txHash])

    useEffect(() => {
        if (tokenLockId) {
            fetchTokenLockerDetails(tokenLockId)
        }
        
    },[tokenLockId])


    return (
        <div className='mb-5'>
            <div className='mt-5'>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(-2)} style={{ cursor: 'pointer' }}>LP Lock List</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>LP Lock List Detail</Breadcrumb.Item>
                    <Breadcrumb.Item>LP Lock List Record Detail</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className='mt-5'>
                <LPLockRecordUnlockIn
                    liquidityLockDetailsOnChain={liquidityLockDetailsOnChain}
                    isLiquidityDataLoading={isLiquidityDataLoading}
                    liquidityLockRecordData={liquidityLockRecordData}
                />
            </div>

            <div className='mt-5'>
                <LPLockRecordPairInfo
                    liquidityLockRecordData={liquidityLockRecordData}
                    isLiquidityDataLoading={isLiquidityDataLoading}
                    liquidityLockDetailsOnChain={liquidityLockDetailsOnChain}
                    tokenLockerDetailsData={tokenLockerDetailsData}
                />
            </div>

            <div className='mt-5'>
                <LPLockRecordLockInfo
                    liquidityLockRecordData={liquidityLockRecordData}
                    tokenLockerDetailsData={tokenLockerDetailsData}
                />
            </div>

            {/* <div className='mt-5 mb-5'>
                <Disclaimer />
            </div> */}
        </div>
    )
}

export default LPLockRecordDetails