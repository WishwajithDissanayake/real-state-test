import React, { useState, useEffect } from 'react'
import { Card, Spin, notification, Button, Tag } from 'antd'
import NumberFormat from 'react-number-format'
import { DateTime } from 'luxon'
import { UncontrolledCollapse } from 'reactstrap';
import { ChevronRight, ChevronDown } from 'react-feather';
import LiquidityVestingInfo from './LiquidityVestingInfo';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import {
    renounceLockOwnership,
    renounceLPTokenLockOwnershipAPI,
    unlockTheTokens,
    getTokenLockDetailsForWithVestingLocksById,
    getTokenLockDetailsForNonVestingLocksById
} from '../../../../Blockchain/services/tokenLock.service'
import { Link } from 'react-router-dom';

function LPLockRecordLockInfo(props) {

    const [collapsed, setCollapsed] = useState(true)
    const {
        liquidityLockRecordData, tokenLockerDetailsData } = props
    const { id: txHash } = useParams()

    const { account, library } = useWeb3React()
    const [liquidityLockDetailsOnChain, setLiquidityLockDetailsOnChain] = useState(null)
    const [isRenounceOwnershipLoading, setIsRenounceOwnershipLoading] = useState(false)
    const [isUnlockButtonVisible, setIsUnlockButtonVisible] = useState(false)
    const [isTokenDataLoading, setIsTokenDataLoading] = useState(true)
    const [isVestingEnabled, setIsVestingEnabled] = useState(false)
    const [isUnlockTokenLoading, setIsUnlockTokenLoading] = useState(false)
    const [isTokenClaimed, setIsTokenClaimed] = useState(false)

    const key = 'updatable';

    useEffect(() => {
        if (liquidityLockDetailsOnChain) {
            const unlockTimestamp = liquidityLockDetailsOnChain?.unlockDateTimestamp
            const currentTimestamp = DateTime.now().toSeconds()

            if (account && account?.toLowerCase() === liquidityLockDetailsOnChain?.ownerAddress.toLowerCase()) {
                if (parseInt(currentTimestamp) >= parseInt(unlockTimestamp)) {
                    setIsUnlockButtonVisible(true)
                } else {
                    setIsUnlockButtonVisible(false)
                }
            } else {
                setIsUnlockButtonVisible(false)
            }


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liquidityLockDetailsOnChain])

    useEffect(() => {
        if (liquidityLockRecordData) {
            fetchTokenLockedDetailsByLockerId(liquidityLockRecordData)
        }

    }, [liquidityLockRecordData])

    const fetchTokenLockedDetailsByLockerId = async (tokenDetails) => {
        try {
            setIsTokenDataLoading(true)
            if (tokenDetails && tokenDetails.initialVestingReleaseDate) {
                setIsVestingEnabled(true)
                const vestingResponse = await getTokenLockDetailsForWithVestingLocksById(tokenDetails.tokenLockId)
                setIsTokenClaimed(vestingResponse?.isTotallyClaimed)
                setLiquidityLockDetailsOnChain(vestingResponse)
                setIsTokenDataLoading(false)
            } else {
                const response = await getTokenLockDetailsForNonVestingLocksById(tokenDetails.tokenLockId)
                setIsTokenClaimed(response?.isClaimed)
                setLiquidityLockDetailsOnChain(response)
                setIsVestingEnabled(false)
                setIsTokenDataLoading(false)
            }
        } catch (error) {
            setLiquidityLockDetailsOnChain(null)
            setIsTokenDataLoading(false)
            console.error("ERROR while fetching lock details on chain", error)
        }
    }


    const handleRenounceOwnership = async () => {
        setIsRenounceOwnershipLoading(true)
        if (txHash) {
            try {
                if (liquidityLockRecordData && liquidityLockRecordData.tokenLockId) {
                    const result = await renounceLockOwnership(liquidityLockRecordData.tokenLockId, library.getSigner())
                    console.log("OWNERSHIP RENOUNCED ", result)
                    if (result) {
                        //update the data from backend
                        await renounceLPTokenLockOwnershipAPI(txHash)
                    }
                    await fetchTokenLockedDetailsByLockerId(liquidityLockRecordData)
                }
                setIsRenounceOwnershipLoading(false)
                notification['success']({
                    key,
                    message: 'Success',
                    description: 'Ownership has been renounced',
                });


            } catch (error) {
                notification['error']({
                    key,
                    message: 'Transaction Error',
                    description: error,
                });
                setIsRenounceOwnershipLoading(false)
                console.error("Error while trying to renounce lock ownership ", error)
            }
        } else {
            setIsRenounceOwnershipLoading(false)
            notification['error']({
                key,
                message: 'Invalid Data',
                description: "Invalid Transaction Hash",
            });
        }
    }

    const handleUnlock = async () => {
        setIsUnlockTokenLoading(true)
        try {
            if (liquidityLockRecordData && liquidityLockRecordData.tokenLockId) {
                const result = await unlockTheTokens(liquidityLockRecordData.tokenLockId, library.getSigner())
                console.log("LP TOKEN UNLOCK RESULT : ", result)
                notification['success']({
                    key,
                    message: 'Success',
                    description: 'Token has been unlocked',
                });
            } else {
                setIsUnlockTokenLoading(false)
                notification['error']({
                    key,
                    message: 'Input Validation Error',
                    description: 'Invalid token lock ID',
                });
            }
            setIsUnlockTokenLoading(false)
        } catch (error) {
            setIsUnlockTokenLoading(false)
            console.error("ERROR while trying to unlock the tokens ", error)
            notification['error']({
                key,
                message: 'Transaction Error',
                description: error,
            });

        }
    }

    return (
        <div>
            <Card title="Lock info" className='kingsale-card-bg'>

                {
                    isTokenDataLoading ? (
                        <div className='d-flex justify-content-center loader'>
                            <Spin size='medium' />
                        </div>
                    ) : (
                        <div>
                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>Total Amount Locked</span>
                                </div>

                                <div>
                                    {
                                        isTokenClaimed ? (
                                            <Tag color="success">claimed</Tag>
                                        ) : (
                                            <NumberFormat
                                                value={liquidityLockRecordData ? liquidityLockRecordData?.lockedTokenAmount : 0}
                                                displayType={'text'}
                                                suffix={liquidityLockRecordData ? ' ' + liquidityLockRecordData?.tokenAddressOneSymbol : ''}
                                                thousandSeparator={true}
                                                decimalScale={5}
                                            />
                                        )
                                    }

                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>Total Values Locked</span>
                                </div>

                                <div>
                                    <span>$0</span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>Owner</span>
                                </div>

                                <div>
                                    <a
                                        href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${tokenLockerDetailsData ? tokenLockerDetailsData[1] : ''}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='break-text'
                                    >
                                        {tokenLockerDetailsData ? tokenLockerDetailsData[1] : ''}
                                    </a>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>Lock Date</span>
                                </div>

                                <div>
                                    <span>
                                        {DateTime.utc(parseInt(liquidityLockRecordData?.updatedAt))
                                            .toFormat("yyyy.LL.dd HH:mm:ss")} UTC
                                    </span>
                                </div>
                            </div>
                            <hr />


                            {/* {isVestingEnabled ? (
                                <div>
                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Initial Vesting Release Date</span>
                                        </div>

                                        <div>
                                            <span>{DateTime.fromSeconds(parseInt(liquidityLockDetailsOnChain?.unlockDateTimestamp))
                                                .toFormat("yyyy.LL.dd HH:mm:ss")} UTC </span>
                                        </div>
                                    </div>
                                    <hr />

                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Initial Vesting Release Percent</span>
                                        </div>

                                        <div>
                                            <span>
                                                {liquidityLockDetailsOnChain ? liquidityLockDetailsOnChain.initialPercentage : '~'}%
                                            </span>
                                        </div>
                                    </div>
                                    <hr />

                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Cycle</span>
                                        </div>

                                        <div>
                                            <span>
                                                {liquidityLockDetailsOnChain ? liquidityLockDetailsOnChain.releaseCycle : '~'} days
                                            </span>
                                        </div>
                                    </div>
                                    <hr />



                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Cycle Release Percent</span>
                                        </div>

                                        <div>
                                            <span>
                                                {liquidityLockDetailsOnChain ? liquidityLockDetailsOnChain.releasePercentage : '~'}%
                                            </span>
                                        </div>
                                    </div>
                                    <hr />

                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Unlocked Amount</span>
                                        </div>

                                        <div>
                                            <span>
                                                <NumberFormat
                                                    value={liquidityLockDetailsOnChain ? liquidityLockDetailsOnChain?.unlockTokenAmountFormatted : 0}
                                                    displayType={'text'}
                                                    suffix={liquidityLockDetailsOnChain ? ' ' + liquidityLockDetailsOnChain?.tokenSymbol : ''}
                                                    thousandSeparator={true}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <hr />


                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Vesting Info</span>
                                        </div>

                                        {
                                            collapsed ?
                                                <span id="toggler"><ChevronRight size={18} onClick={() => setCollapsed(false)} /></span>
                                                :
                                                <span id="toggler"><ChevronDown size={18} onClick={() => setCollapsed(true)} /></span>
                                        }
                                    </div>
                                    <hr />

                                    <div>
                                        <UncontrolledCollapse toggler="#toggler">
                                            <LiquidityVestingInfo
                                                isLiquidityDataLoading={isTokenDataLoading}
                                                liquidityLockDetailsOnChain={liquidityLockDetailsOnChain}
                                            />
                                        </UncontrolledCollapse>
                                    </div>
                                </div>
                            ) : ( */}
                                <div>
                                    <div className='d-md-flex justify-content-between'>
                                        <div>
                                            <span>Unlock Date</span>
                                        </div>

                                        <div>
                                            <span>
                                                {DateTime.fromSeconds(parseInt(liquidityLockRecordData?.unlockTimestamp))
                                                    .toFormat("yyyy.LL.dd HH:mm:ss")} UTC</span>
                                        </div>
                                    </div>
                                    <hr />
                                </div>

                            {/* )
                            } */}

                            <div className='d-md-flex justify-content-center mt-4'>
                                {
                                    (account && account?.toLowerCase()) === liquidityLockDetailsOnChain?.ownerAddress.toLowerCase() &&
                                    <>
                                        <div className='ownership-renounce-btn'>
                                            <Button
                                                loading={isRenounceOwnershipLoading}
                                                onClick={handleRenounceOwnership}
                                                className='kingsale-primary-button mx-2'>
                                                Renounce Lock Ownership
                                            </Button>
                                        </div>

                                        <div className='extend-lock-time-btn'>
                                            <Link to={`/liquidity-lock/record/update/${txHash}`}>
                                                <Button
                                                    className='kingsale-primary-button mx-2'>
                                                    Update
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className='unlock-btn'>
                                            <Button
                                                disabled={!isUnlockButtonVisible}
                                                loading={isUnlockTokenLoading}
                                                onClick={handleUnlock}
                                                className='kingsale-primary-button mx-2'>
                                                Unlock
                                            </Button>
                                        </div></>
                                }
                            </div>
                        </div>
                    )
                }

            </Card>
        </div>
    )
}

export default LPLockRecordLockInfo