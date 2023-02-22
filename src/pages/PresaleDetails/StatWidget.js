import { Card, Spin, Tag } from 'antd'
import React, { useState, useEffect } from 'react'
import usePoolStatus from '../../Hooks/usePoolStatus'
import { useWeb3React } from '@web3-react/core'
import useUserPresalePoolDetails from '../../Hooks/useUserPresalePoolDetails'
import {
    getMinAndMaxContributionAmount,
    getTokensPerBNBInPool
} from '../../Blockchain/services/presale.service'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../Providers/SocketProvider'

function StatWidget(props) {

    const { t } = useTranslation();
    const { presaleSaleDetails, presaleAddress } = props
    const [minimumBuy, setMinimumBuy] = useState(0.0)
    const [maximumBuy, setMaximumBuy] = useState(0.0)
    const [totalContributorCount, setTotalContributorCount] = useState(0.0)
    const [tokenPerBNB, setTokenPerBNB] = useState(0.0)

    const [isMinMaxAmountLoading, setIsMinMaxAmountLoading] = useState(false)
    // const [isTotalContributorCountLoading, setIsTotalContributorCountLoading] = useState(false)
    const [isTokenPerBNBLoading, setIsTokenPerBNBLoading] = useState(false)
    const { account } = useWeb3React()
    const {
        isLoading: isUserContributionDetailsLoading,
        userPresalePoolDetails
    } = useUserPresalePoolDetails({
        poolAddress: presaleAddress,
        walletAddress: account,
        liquidityTokenName: presaleAddress?.liquidityTokenName
    })

    const socket = useSocket()

    useEffect(() => {
        if (socket && presaleAddress) {
            fetchTotalContributorCount()
        }
        return () => {
            if (socket) {
                socket?.off('connect')
                socket?.off('disconnect')
                socket?.off('presaleContributorStatus')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, presaleAddress])

    useEffect(() => {
        fetchMinMaxContributionAmounts()
        if (presaleAddress) {
            fetchTokenPerBNBAmountInPool()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presaleAddress, presaleSaleDetails])

    useEffect(() => {

        const interval = setInterval(() => {
            if (presaleAddress) {
                fetchTotalContributorCount(presaleAddress)
            }
            //update every 20 seconds 
        }, 1000 * 20)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presaleAddress])

    const fetchMinMaxContributionAmounts = async () => {
        try {
            setIsMinMaxAmountLoading(true)
            const minMaxAmountResponse = await getMinAndMaxContributionAmount(presaleAddress)
            setMinimumBuy(minMaxAmountResponse.minContributionAmount)
            setMaximumBuy(minMaxAmountResponse.maxContributionAmount)
            setIsMinMaxAmountLoading(false)
        } catch (error) {
            setMinimumBuy(0.0)
            setMaximumBuy(0.0)
            setIsMinMaxAmountLoading(false)
            console.error("ERROR Fetching min max contribution amounts : ", error)
        }
    }

    const fetchTotalContributorCount = async () => {

        socket?.emit('presaleContributorStatus', { presaleAddress: presaleAddress })
        socket?.on('presaleContributorStatus', (data) => {
            if (data?.presaleAddress === presaleAddress) {
                setTotalContributorCount(data?.contributorCount)
            }
        })
    }

    const fetchTokenPerBNBAmountInPool = async () => {
        try {
            setIsTokenPerBNBLoading(true)
            const tokenPerBNBResponse = await getTokensPerBNBInPool(presaleAddress)
            setTokenPerBNB(tokenPerBNBResponse)
            //setTotalContributorCount(contributorCountResponse)
            setIsTokenPerBNBLoading(false)
        } catch (error) {
            setTokenPerBNB(0)
            setIsTokenPerBNBLoading(false)
            console.error("ERROR Fetching tokens per bnb amount in the pool : ", error)
        }
    }

    const {
        isLoading: isPoolStatusLoading,
        poolStatus
    } = usePoolStatus({ poolAddress: presaleAddress })
    return (
        <div>
            <Card className="mt-2 kingsale-card-bg">
                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Status')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isPoolStatusLoading ? (
                                <div className='loader'>
                                    <Spin size="small" />
                                </div>
                            ) : (
                                <Tag color={poolStatus?.statusColor}>
                                    {poolStatus?.statusName}
                                </Tag>
                            )
                        }

                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Sale type')}</span>
                    </div>

                    <div className='text-end'>
                        <span className='primary-text'>{t('Public')}</span>
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Minimum Buy')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isMinMaxAmountLoading ? (
                                <div className=''>
                                    <Spin size='small' />
                                </div>
                            ) : (
                                <NumberFormat
                                    value={minimumBuy ? minimumBuy : '0.00'}
                                    displayType={'text'}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                    suffix={' ' + presaleSaleDetails?.liquidityTokenName}
                                />
                            )
                        }
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Maximum Buy')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isMinMaxAmountLoading ? (
                                <div className=''>
                                    <Spin size='small' />
                                </div>
                            ) : (
                                <NumberFormat
                                    value={maximumBuy ? maximumBuy : '0.00'}
                                    displayType={'text'}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                    suffix={' ' + presaleSaleDetails?.liquidityTokenName}
                                />
                            )
                        }
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Total Contributors')}</span>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={totalContributorCount ? totalContributorCount : '0'}
                            displayType={'text'}
                            thousandSeparator={true}
                        />
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('My Contribution')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isUserContributionDetailsLoading ? (
                                <div className=''>
                                    <Spin size='small' />
                                </div>
                            ) : (
                                <NumberFormat
                                    value={userPresalePoolDetails ? userPresalePoolDetails?.myContributionInBNB : '0.00'}
                                    decimalScale={2}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' ' + presaleSaleDetails?.liquidityTokenName}
                                />
                            )
                        }
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('My Reserved Tokens')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isUserContributionDetailsLoading ? (
                                <div className=''>
                                    <Spin size='small' />
                                </div>
                            ) : (
                                <NumberFormat
                                    value={userPresalePoolDetails ? userPresalePoolDetails?.userTokenReserved : '0.00'}
                                    decimalScale={2}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={presaleSaleDetails ? "  " + presaleSaleDetails?.tokenSymbol : ''}
                                />
                            )
                        }
                    </div>
                </div>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <span>{t('Fund Pool Rate')}</span>
                    </div>

                    <div className='text-end'>
                        {
                            isTokenPerBNBLoading ? (
                                <div className=''>
                                    <Spin size='small' />
                                </div>
                            ) : (
                                <NumberFormat
                                    value={tokenPerBNB ? tokenPerBNB : '0'}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={presaleSaleDetails ? "  " + presaleSaleDetails?.tokenSymbol : ''}
                                />
                            )
                        }
                    </div>
                </div>
                <hr />
            </Card>
        </div>
    )
}

export default StatWidget