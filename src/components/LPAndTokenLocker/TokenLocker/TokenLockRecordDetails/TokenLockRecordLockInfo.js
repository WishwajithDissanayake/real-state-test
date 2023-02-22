import React, { useEffect, useState } from 'react'
import { Button, Card, Spin, notification, Tag } from 'antd'
import { UncontrolledCollapse } from 'reactstrap';
import { ChevronRight, ChevronDown } from 'react-feather';
import VestingInfo from './VestingInfo';
import NumberFormat from 'react-number-format';
import { DateTime } from 'luxon';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';
import {
    renounceLockOwnership,
    renounceTokenLockOwnershipAPI,
    unlockTheTokens,
    getTokenLockDetailsForWithVestingLocksById,
    getTokenLockDetailsForNonVestingLocksById
} from '../../../../Blockchain/services/tokenLock.service'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function TokenLockRecordLockInfo(props) {

    const [collapsed, setCollapsed] = useState(true)
    const { id: txHash } = useParams()
    const {
        tokenLockRecordData
    } = props
    const { t } = useTranslation();


    const [tokenLockDetailsOnChain, setTokenLockDetailsOnChain] = useState(null)
    const { account, library } = useWeb3React()
    const [isRenounceOwnershipLoading, setIsRenounceOwnershipLoading] = useState(false)
    const [isUnlockButtonVisible, setIsUnlockButtonVisible] = useState(false)
    const [isTokenDataLoading, setIsTokenDataLoading] = useState(true)
    const [isVestingEnabled, setIsVestingEnabled] = useState(false)
    const [isUnlockTokenLoading, setIsUnlockTokenLoading] = useState(false)
    const [isTokenClaimed, setIsTokenClaimed] = useState(false)

    const key = 'updatable';

    useEffect(() => {
        if (tokenLockDetailsOnChain) {
            const unlockTimestamp = tokenLockDetailsOnChain?.unlockDateTimestamp
            const currentTimestamp = DateTime.now().toSeconds()

            if (account && account?.toLowerCase() === tokenLockDetailsOnChain?.ownerAddress.toLowerCase()) {
                if (parseInt(currentTimestamp) >= parseInt(unlockTimestamp)) {
                    setIsUnlockButtonVisible(true)
                } else {
                    setIsUnlockButtonVisible(false)
                }
            } else {
                setIsUnlockButtonVisible(false)
            }


        }
        console.log("tokenLockDetailsOnChain", tokenLockDetailsOnChain)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenLockDetailsOnChain])

    useEffect(() => {
        if (tokenLockRecordData) {
            fetchTokenLockedDetailsByLockerId(tokenLockRecordData)
        }

    }, [tokenLockRecordData])

    const fetchTokenLockedDetailsByLockerId = async (tokenDetails) => {
        try {
            setIsTokenDataLoading(true)
            if (tokenDetails && tokenDetails.initialVestingReleaseDate) {
                setIsVestingEnabled(true)
                const vestingResponse = await getTokenLockDetailsForWithVestingLocksById(tokenDetails.tokenLockId)
                setIsTokenClaimed(vestingResponse?.isTotallyClaimed)
                setTokenLockDetailsOnChain(vestingResponse)
                setIsTokenDataLoading(false)
            } else {
                const response = await getTokenLockDetailsForNonVestingLocksById(tokenDetails.tokenLockId)
                setIsTokenClaimed(response?.isClaimed)
                setTokenLockDetailsOnChain(response)
                setIsVestingEnabled(false)
                setIsTokenDataLoading(false)
            }
        } catch (error) {
            setTokenLockDetailsOnChain(null)
            setIsTokenDataLoading(false)
            console.error("ERROR while fetching lock details on chain", error)
        }
    }


    const handleRenounceOwnership = async () => {
        setIsRenounceOwnershipLoading(true)
        if (txHash) {
            try {
                if (tokenLockRecordData && tokenLockRecordData.tokenLockId) {
                    const result = await renounceLockOwnership(tokenLockRecordData.tokenLockId, library.getSigner())
                    console.log("OWNERSHIP RENOUNCED ", result)
                    if (result) {
                        //update the data from backend
                        await renounceTokenLockOwnershipAPI(txHash)
                    }
                    await fetchTokenLockedDetailsByLockerId(tokenLockRecordData)
                }
                setIsRenounceOwnershipLoading(false)
                notification['success']({
                    key,
                    message: t('Success'),
                    description: t('Ownership has been renounced'),
                });

            } catch (error) {
                notification['error']({
                    key,
                    message: t('Transaction Error'),
                    description: error,
                });
                setIsRenounceOwnershipLoading(false)
                console.error("Error while trying to renounce lock ownership ", error)
            }
        } else {
            setIsRenounceOwnershipLoading(false)
            notification['error']({
                key,
                message: t('Invalid Data'),
                description: t("Invalid Transaction Hash"),
            });
        }
    }

    const handleUnlock = async () => {
        setIsUnlockTokenLoading(true)
        try {
            if (tokenLockRecordData && tokenLockRecordData.tokenLockId) {
                const result = await unlockTheTokens(tokenLockRecordData.tokenLockId, library.getSigner())
                console.log("TOKEN UNLOCK RESULT : ", result)
                notification['success']({
                    key,
                    message: t('Success'),
                    description: t('Token has been unlocked'),
                });
            } else {
                setIsUnlockTokenLoading(false)
                notification['error']({
                    key,
                    message: t('Input Validation Error'),
                    description: t('Invalid token lock ID'),
                });
            }
            setIsUnlockTokenLoading(false)
        } catch (error) {
            setIsUnlockTokenLoading(false)
            console.error("ERROR while trying to unlock the tokens ", error)
            notification['error']({
                key,
                message: t('Transaction Error'),
                description: error,
            });

        }
    }

    return (
        <div>
            <Card title={t("Lock info")} className='kingsale-card-bg'>

                {
                    isTokenDataLoading ? (
                        <div className='d-flex justify-content-center'>
                            <Spin size='medium' />
                        </div>
                    ) : (
                        <div>
                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Total Amount Locked')}</span>
                                </div>

                                <div>
                                    <span>
                                        {
                                            isTokenClaimed ? (
                                                <Tag color="success">claimed</Tag>
                                            ) : (
                                                <NumberFormat
                                                    value={tokenLockDetailsOnChain ? tokenLockDetailsOnChain?.tokenLockedAmountFormatted : 0}
                                                    displayType={'text'}
                                                    suffix={tokenLockDetailsOnChain ? ' ' + tokenLockDetailsOnChain?.tokenSymbol : ''}
                                                    thousandSeparator={true}
                                                />
                                            )
                                        }

                                    </span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Total Values Locked')}</span>
                                </div>

                                <div>
                                    <span>$0</span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Owner')}</span>
                                </div>

                                <div>
                                    <a
                                        href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${tokenLockDetailsOnChain?.ownerAddress}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='break-text'
                                    >
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.ownerAddress : ''}
                                    </a>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Lock Date')}</span>
                                </div>

                                <div>
                                    <span>
                                        {DateTime.fromSeconds(parseInt(tokenLockDetailsOnChain?.lockedDateTimestamp))
                                            .toUTC()
                                            .toFormat("yyyy.LL.dd HH:mm:ss")} UTC</span>
                                </div>
                            </div>
                            <hr />

                            {
                                isVestingEnabled ? (
                                    <div>
                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Initial Vesting Release Date')}</span>
                                            </div>

                                            <div>
                                                <span>{DateTime.fromSeconds(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp))
                                                    .toUTC()
                                                    .toFormat("yyyy.LL.dd HH:mm:ss")} UTC </span>
                                            </div>
                                        </div>
                                        <hr />

                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Initial Vesting Release Percent')}</span>
                                            </div>

                                            <div>
                                                <span>
                                                    {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.initialPercentage : '~'}%
                                                </span>
                                            </div>
                                        </div>
                                        <hr />

                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Cycle')}</span>
                                            </div>

                                            <div>
                                                <span>
                                                    {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.releaseCycle : '~'} days
                                                </span>
                                            </div>
                                        </div>
                                        <hr />



                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Cycle Release Percent')}</span>
                                            </div>

                                            <div>
                                                <span>
                                                    {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.releasePercentage : '~'}%
                                                </span>
                                            </div>
                                        </div>
                                        <hr />

                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Unlocked Amount')}</span>
                                            </div>

                                            <div>
                                                <span>
                                                    <NumberFormat
                                                        value={tokenLockDetailsOnChain ? tokenLockDetailsOnChain?.unlockTokenAmountFormatted : 0}
                                                        displayType={'text'}
                                                        suffix={tokenLockDetailsOnChain ? ' ' + tokenLockDetailsOnChain?.tokenSymbol : ''}
                                                        thousandSeparator={true}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                        <hr />


                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Vesting Info')}</span>
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
                                                <VestingInfo
                                                    isTokenDataLoading={isTokenDataLoading}
                                                    tokenLockDetailsOnChain={tokenLockDetailsOnChain}
                                                />
                                            </UncontrolledCollapse>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className='d-md-flex justify-content-between'>
                                            <div>
                                                <span>{t('Unlock Date')}</span>
                                            </div>

                                            <div>
                                                <span>
                                                    {DateTime.fromSeconds(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp))
                                                        .toUTC()
                                                        .toFormat("yyyy.LL.dd HH:mm:ss")} UTC</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className='d-md-flex justify-content-center mt-4'>
                                {
                                    (account && account?.toLowerCase()) === tokenLockDetailsOnChain?.ownerAddress.toLowerCase() &&
                                    <>
                                        <div className='ownership-renounce-btn'>
                                            <Button
                                                loading={isRenounceOwnershipLoading}
                                                onClick={handleRenounceOwnership}
                                                className='kingsale-primary-button mx-2'>
                                                {t('Renounce Lock Ownership')}
                                            </Button>
                                        </div>

                                        <div className='extend-lock-time-btn'>
                                            <Link to={`/token-lock/record/update/${txHash}`}>
                                                <Button
                                                    className='kingsale-primary-button mx-2'>
                                                    {t('Update')}
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className='unlock-btn'>
                                            <Button
                                                // disabled={!isUnlockButtonVisible}
                                                loading={isUnlockTokenLoading}
                                                onClick={handleUnlock}
                                                className='kingsale-primary-button mx-2'>
                                                {t('Unlock')}
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

export default TokenLockRecordLockInfo