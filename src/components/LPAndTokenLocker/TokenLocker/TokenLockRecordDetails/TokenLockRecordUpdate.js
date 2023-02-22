import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Spin,
    Breadcrumb,
    Input,
    Checkbox,
    DatePicker,
    Alert,
    notification
} from 'antd'
import { ExternalLink } from 'react-feather'
import moment from 'moment'
import { Row, Col } from 'reactstrap'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    getTokenLockDetailsForWithVestingLocksById,
    getTokenLockDetailsForNonVestingLocksById,
    extendLockExpireTime
} from '../../../../Blockchain/services/tokenLock.service'
import { useWeb3React } from '@web3-react/core'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next';

function TokenLockRecordUpdate() {

    const { id: txHash } = useParams()

    const [tokenLockDetailsOnChain, setTokenLockDetailsOnChain] = useState(null)
    const [isTokenDataLoading, setIsTokenDataLoading] = useState(false)
    const [isVestingEnabled, setIsVestingEnabled] = useState(false)
    const [newUnlockDate, setNewUnlockDate] = useState('')
    const [isUpdateLockTimeLoading, setIsUpdateLockTimeLoading] = useState(false)
    const [tokenLockRecordData, setTokenLockRecordData] = useState(null)
    const { account, library } = useWeb3React()
    const { t } = useTranslation();

    const key = 'updatable';

    const handleUpdateLockTime = async () => {
        setIsUpdateLockTimeLoading(true)
        try {

            if (!account) {
                notification['error']({
                    key,
                    message: t('Authentication Error'),
                    description:
                        t('Please connect your wallet to proceed'),
                });
                setIsUpdateLockTimeLoading(false)
                return
            }

            if (tokenLockRecordData && tokenLockRecordData.tokenLockId) {
                const extendedExpireTimestamp = DateTime.fromFormat(newUnlockDate, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
                const result = await extendLockExpireTime(tokenLockRecordData.tokenLockId, extendedExpireTimestamp, library.getSigner())
                console.log("LOCK TIME EXTENDED ", result)
                notification['success']({
                    key,
                    message: t('Success'),
                    description: t('Lock expire time has been updated.'),
                });
                const redirectLink = `/token-lock/record/${tokenLockRecordData.transactionHash}`
                navigate(redirectLink)
            } else {
                notification['error']({
                    key,
                    message: t('Execution Error'),
                    description: t("Invalid lock id"),
                });
            }
            setIsUpdateLockTimeLoading(false)

        } catch (error) {
            notification['error']({
                key,
                message: t('Execution Error'),
                description: error,
            });
            setIsUpdateLockTimeLoading(false)
            console.error("ERROR while trying to update the lock time ", error)
        }
    }

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
                const vestingResponse = await getTokenLockDetailsForWithVestingLocksById(tokenDetails.tokenLockId)
                setTokenLockDetailsOnChain(vestingResponse)
                setIsVestingEnabled(true)
            } else {
                const response = await getTokenLockDetailsForNonVestingLocksById(tokenDetails.tokenLockId)
                setTokenLockDetailsOnChain(response)
                setIsVestingEnabled(false)
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
            payload = apiResponse.data.payload
            setTokenLockRecordData(payload)
            return payload
        } catch (error) {
            setTokenLockRecordData(null)
            console.error("ERROR while fetching token lock record from API ", error)
            return payload

        }
    }


    const handleExtendedLockData = (value, dateString) => {
        setNewUnlockDate(dateString)
    }

    useEffect(() => {
        if (txHash) {
            fetchAllTokenDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txHash])

    const tokenLockWarningMessage = `Please exclude Kings sale's lockup address ${process.env.REACT_APP_LP_LOCK_CONTRACT_ADDRESS} 
    from fees, rewards, max tx amount to start locking tokens.
    We don't support rebase tokens.`

    const navigate = useNavigate()

    return (
        <div className='container-fluid mb-5'>

            <div className='mt-5'>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(-3)} style={{ cursor: 'pointer' }}>{t('Token Lock List')}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(-2)} style={{ cursor: 'pointer' }}>{t('Token Lock List Detail')}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>{t('Token Lock List Record Detail')}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>{t('Token Lock List Record Detail Update')}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Card title="Edit Your Lock" className='kingsale-card-bg mt-5'>

                {
                    isTokenDataLoading ? (
                        <div className='d-flex justify-content-center'>
                            <Spin size='medium' />
                        </div>
                    ) : (
                        <div>
                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Token Address')}</span>
                                </div>

                                <div>
                                    <a
                                        href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${tokenLockDetailsOnChain?.tokenAddress}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='break-text'
                                    >
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenAddress : ''}
                                        <ExternalLink size={14} style={{ marginTop: '-4px' }} />
                                    </a>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Name')}</span>
                                </div>

                                <div>
                                    <span>
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenName : ''}
                                    </span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Symbol')}</span>
                                </div>

                                <div>
                                    <span>
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenSymbol : ''}
                                    </span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Decimals')}</span>
                                </div>

                                <div>
                                    <span>
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenDecimals : ''}
                                    </span>
                                </div>
                            </div>
                            <hr />

                            <div className='col-12'>
                                <span>{t('Amount')}</span>
                                <Input
                                    defaultValue="100"
                                    lang='en'
                                    disabled={true}
                                    size="large"
                                />
                            </div>

                            {
                                isVestingEnabled ? (
                                    <>
                                        <div className='col-12 mt-3'>
                                            <Checkbox
                                                defaultChecked={isVestingEnabled ? true : false}
                                                disabled={true}>
                                                {t('Vesting')}
                                            </Checkbox>
                                        </div>

                                        <div className='d-md-flex justify-content-between'>
                                            <div className='mt-3 col-md-5'>
                                                <span>{t('TGE Date (UTC time)')}</span>
                                                <DatePicker
                                                    defaultValue={moment.unix(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp))}
                                                    onChange={handleExtendedLockData}
                                                    className="col-12 rounded-input"
                                                    format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                                                    disabledDate={d => !d || d.isBefore(moment.unix(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp)).format('yyyy-MM-DD').toString())}
                                                    showTime
                                                    placeholder={t('Select date')}
                                                    size="large"
                                                />
                                            </div>

                                            <div className='mt-3 col-md-5'>
                                                <span>{t('Initial Vesting Release Percentage')}</span>
                                                <Input lang='en' defaultValue={tokenLockDetailsOnChain?.initialPercentage} size="large" disabled={true} />
                                            </div>
                                        </div>

                                        <div className='d-md-flex justify-content-between'>
                                            <div className='mt-3 col-md-5'>
                                                <span>{t('Cycle (days)')}</span>
                                                <Input lang='en' defaultValue={tokenLockDetailsOnChain?.releaseCycle} size="large" disabled={true} />
                                            </div>

                                            <div className='mt-3 col-md-5'>
                                                <span>{t('Cycle Release Percentage')}</span>
                                                <Input lang='en' defaultValue={tokenLockDetailsOnChain?.releasePercentage} size="large" disabled={true} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='col-12 mt-2'>
                                            <span>{t('Unlock Time')}</span>
                                            <DatePicker
                                                defaultValue={moment.unix(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp))}
                                                onChange={handleExtendedLockData}
                                                className="col-12 rounded-input"
                                                format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                                                disabledDate={d => !d || d.isBefore(moment.unix(parseInt(tokenLockDetailsOnChain?.unlockDateTimestamp)).format('yyyy-MM-DD').toString())}
                                                showTime
                                                placeholder={t('Select date')}
                                                size="large"
                                            />
                                        </div>

                                    </>
                                )
                            }


                            <Row className='mt-3'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-1 mb-4">
                                    <Alert
                                        message={tokenLockWarningMessage}
                                        type="warning"
                                        closable={false}
                                    />
                                </Col>
                            </Row>

                            <div className='text-center mt-3'>
                                <Button
                                    onClick={handleUpdateLockTime}
                                    loading={isUpdateLockTimeLoading}
                                    className='kingsale-primary-button'>{t('Update Your Lock')}</Button>
                            </div>
                        </div>
                    )
                }

            </Card>
        </div>
    )
}

export default TokenLockRecordUpdate

