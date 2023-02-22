import React, { useEffect, useMemo, useState } from 'react'
import { Card, Button, Spin, Image } from 'antd'
import { Collapse } from 'reactstrap'
import KingsFundLogo from '../../images/kingsfund.png'
import './StakingWidget.css'
import { ChevronDown, ChevronUp, Clock, ExternalLink } from 'react-feather'
import { useDispatch } from "react-redux";
import { open } from '../../Redux/WalletConnect'
import { useWeb3React } from '@web3-react/core'
import RoiCalculator from './StakingWidget/RoiCalculator'
import { useTranslation } from 'react-i18next';
import {
    calculateLockDuration,
    getTotalStakedAmount,
    getStakedTokenDetails,
    getStakingPoolEndBlockNumber,
    getUserStakedDetails,
} from '../../Blockchain/services/staking.service'
import NumberFormat from 'react-number-format'
import UnstakeTokenModal from './StakingWidget/UnstakeTokenModal'
import StakingAPRButton from './StakingWidget/StakingAPRButton'
import StakingTokenInfoHeader from './StakingWidget/StakingTokenInfoHeader'
import RewardsDetails from './StakingWidget/RewardsDetails'
import StakingDetails from './StakingWidget/StakingDetails'
import StakingModel from './StakingWidget/StakingModel'
import AddToMetamaskButton from './StakingWidget/AddToMetamaskButton'
import { useSocket } from '../../Providers/SocketProvider'

function StakingWidget(props) {

    const { poolData } = props
    const [cardExpanded, setCardExpanded] = useState(false)
    const dispatch = useDispatch()
    const { account } = useWeb3React()
    const { t } = useTranslation()

    const [aprPercentage, setAprPercentage] = useState(0.0)

    const [lockPeriodInDays, setLockPeriodInDays] = useState(0.0)
    const [isLockPeriodLoading, setIsLockPeriodLoading] = useState(false)

    const [totalStakedAmount, setTotalStakedAmount] = useState(0.0)
    const [isTotalStakedAmountLoading, setIsTotalStakedAmountLoading] = useState(false)

    const [stakedTokenDetails, setStakedTokenDetails] = useState(null)
    const [isStakedTokenDetailsLoading, setIsStakedTokenDetailsLoading] = useState(null)

    const [currentBlockNumber, setCurrentBlockNumber] = useState(0)
    const [endingBlockNumber, setEndingBlockNumber] = useState(0)
    const [isEndingBlockLoading, setIsEndingBlockLoading] = useState(false)
    const [userStakedDetails, setUserStakedDetails] = useState(null)
    const [isUserStakedDetailsLoading, setIsUserStakedDetailsLoading] = useState(false)

    const [isStakingAmountModelVisible, setIsStakingAmountModelVisible] = useState(false)
    const [userStakingAmount, setUserStakingAmount] = useState(0.0)
    const [isROICalculatorVisible, setIsROICalculatorVisible] = useState(false)
    const [isUnStakingAmountModelVisible, setIsUnStakingAmountModelVisible] = useState(false)
    const [isForceRefreshData, setIsForceRefreshData] = useState(false)

    const socket = useSocket()

    useEffect(() => {
        if (socket) {
            fetchCurrentBlockNumber()
        }

        return () => {
            if (socket) {
                socket?.off('connect')
                socket?.off('disconnect')
                socket?.off('blockNumber')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])


    useEffect(() => {
        const interval = setInterval(() => {
            if (socket) {
                fetchCurrentBlockNumber()
            }
            //update every 3 seconds 
        }, 1000 * 3)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    useEffect(() => {
        if (isForceRefreshData) {
            if (poolData && poolData?.stakingPoolAddress) {
                fetchUserStakedDetails(poolData?.stakingPoolAddress)
                fetchTotalStakedAmount(poolData?.stakingPoolAddress)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isForceRefreshData])

    useEffect(() => {
        if (poolData && poolData?.stakingPoolAddress) {
            fetchLockPeriod(poolData?.stakingPoolAddress)
            fetchTotalStakedAmount(poolData?.stakingPoolAddress)
            fetchStakedTokenDetails(poolData?.stakingPoolAddress)
            fetchRewardsEndingBlock(poolData?.stakingPoolAddress)
            fetchUserStakedDetails(poolData?.stakingPoolAddress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolData, account])


    const fetchCurrentBlockNumber = async () => {
        socket?.emit('requestBlock')
        socket?.on('blockNumber', (blockNumber) => {
            if (blockNumber) {
                setCurrentBlockNumber(blockNumber)
            }
        })
    }

    const cachedBlockNumber = useMemo(() => {
        if (currentBlockNumber && endingBlockNumber) {
            const diff = parseInt(endingBlockNumber) - parseInt(currentBlockNumber)
            return diff < 0 ? 0 : diff
        }
    }, [currentBlockNumber, endingBlockNumber])


    const fetchLockPeriod = async (stakingPoolAddress) => {
        setIsLockPeriodLoading(true)
        try {
            const lockPeriodResponse = await calculateLockDuration(stakingPoolAddress)
            setLockPeriodInDays(lockPeriodResponse)
            setIsLockPeriodLoading(false)
        } catch (error) {
            setLockPeriodInDays(0)
            setIsLockPeriodLoading(false)
            console.log("ERROR while fetching lock period of the pool", error)
        }
    }


    const fetchTotalStakedAmount = async (stakingPoolAddress) => {
        setIsTotalStakedAmountLoading(true)
        try {
            const totalStakedAmountResponse = await getTotalStakedAmount(stakingPoolAddress)
            setTotalStakedAmount(totalStakedAmountResponse)
            setIsTotalStakedAmountLoading(false)
        } catch (error) {
            setTotalStakedAmount(0.0)
            setIsTotalStakedAmountLoading(false)
            console.log("ERROR while calculating total staked amount ", error)
        }
    }

    const fetchStakedTokenDetails = async (stakingPoolAddress) => {
        setIsStakedTokenDetailsLoading(true)
        try {
            const stakedTokenDetailsResponse = await getStakedTokenDetails(stakingPoolAddress)
            setStakedTokenDetails(stakedTokenDetailsResponse)
            setIsStakedTokenDetailsLoading(false)
        } catch (error) {
            setStakedTokenDetails(null)
            setIsStakedTokenDetailsLoading(false)
            console.log("ERROR while stake token details ", error)
        }
    }

    const fetchRewardsEndingBlock = async (stakingPoolAddress) => {
        setIsEndingBlockLoading(true)
        try {
            const endingBlockResponse = await getStakingPoolEndBlockNumber(stakingPoolAddress)
            setEndingBlockNumber(endingBlockResponse)
            setIsEndingBlockLoading(false)
        } catch (error) {
            setEndingBlockNumber(0.0)
            setIsEndingBlockLoading(false)
            console.log("ERROR while fetching rewards ending block ", error)
        }
    }

    const fetchUserStakedDetails = async (stakingPoolAddress) => {
        setIsUserStakedDetailsLoading(true)
        try {
            const userStakedDetailsResponse = await getUserStakedDetails(stakingPoolAddress, account)
            setUserStakedDetails(userStakedDetailsResponse)
            setIsUserStakedDetailsLoading(false)
        } catch (error) {
            setUserStakedDetails(null)
            setIsUserStakedDetailsLoading(false)
            console.log("ERROR while fetching user staked details ", error)
        }
    }


    const getPrivateSaleImage = () => {
        if (poolData && poolData.logoUrl) {
            return poolData.logoUrl
        } else {
            return KingsFundLogo
        }
    }

    return (
        <div>
            <Card className='kingsale-card-bg mt-4 h-100'>
                <div className="d-flex justify-content-center">
                    <Image
                        fallback={KingsFundLogo}
                        src={getPrivateSaleImage()}
                        alt="card-image-logo"
                        preview={false}
                        className="card-logo" />
                </div>

                <div className='mt-1'>
                    <StakingTokenInfoHeader poolData={poolData} />
                </div>
                <hr />

                <StakingAPRButton
                    stakingPoolData={poolData}
                    cachedBlockNumber={cachedBlockNumber}
                    stakingPoolAddress={poolData?.stakingPoolAddress}
                    setIsROICalculatorVisible={setIsROICalculatorVisible}
                    setAprPercentage={setAprPercentage}
                    aprPercentage={aprPercentage}
                />

                <div className='mt-2'>
                    <div className='d-flex justify-content-between'>
                        <div className='small primary-text'>
                            {t('Lock Duration')}
                        </div>

                        <div className='small'>
                            {
                                isLockPeriodLoading ? (
                                    <div className='d-flex justify-content-start'>
                                        <Spin size='small' />
                                    </div>
                                ) : (
                                    <>
                                        {lockPeriodInDays} {t('days')}
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>

                {
                    account &&
                    <>
                        <div className='mt-3 user-staking-rewards-container'>
                            <RewardsDetails
                                poolData={poolData}
                                isUserStakedDetailsLoading={isUserStakedDetailsLoading}
                                userStakedDetails={userStakedDetails}
                            />
                        </div>

                        <div className='mt-3 user-staking-token-container'>
                            <StakingDetails
                                poolData={poolData}
                                isUserStakedDetailsLoading={isUserStakedDetailsLoading}
                                userStakedDetails={userStakedDetails}
                            />

                        </div>
                    </>
                }

                {
                    account ?
                        <>
                            <Button
                                size='small'
                                disabled={cachedBlockNumber === 0}
                                className='kingsale-primary-button col-12 mt-2'
                                onClick={() => setIsStakingAmountModelVisible(true)}>
                                Stake
                            </Button>

                            {
                                parseFloat(userStakedDetails?.stakedAmount) > 0 && <Button
                                    size='small'
                                    className='kingsale-primary-button col-12 mt-2'
                                    onClick={() => setIsUnStakingAmountModelVisible(true)}>
                                    Unstake
                                </Button>
                            }

                        </>
                        :
                        <>
                            <p className='mt-2 fw-bold'>{t('Start Earning')}</p>
                            <Button size='small' className='kingsale-primary-button col-12' onClick={() => dispatch(open())}>{t('Connect Wallet')}</Button>
                        </>
                }

                <hr />

                <div className='text-center'>
                    {
                        cardExpanded ?
                            <Button size="small" type="text" onClick={() => setCardExpanded(false)}>{t('Hide')} <ChevronUp size={16} /></Button>
                            :
                            <Button size="small" type="text" onClick={() => setCardExpanded(true)}>{t('Details')} <ChevronDown size={16} /></Button>

                    }
                </div>

                <Collapse isOpen={cardExpanded}>
                    <div className='mt-2'>
                        <div className='d-flex justify-content-between'>
                            <div className='small'>
                                {t('Total staked:')}
                            </div>

                            <div className='small'>

                                {
                                    isTotalStakedAmountLoading || isStakedTokenDetailsLoading ? (
                                        <div className='d-flex justify-content-start'>
                                            <Spin size='small' />
                                        </div>
                                    ) : (
                                        <NumberFormat
                                            displayType='text'
                                            decimalScale={3}
                                            thousandSeparator={true}
                                            value={totalStakedAmount ? totalStakedAmount : 0}
                                            suffix={` ${stakedTokenDetails?.tokenSymbol}`}
                                        />
                                    )
                                }
                            </div>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <div className='small'>
                                {t('Ends in:')}
                            </div>

                            <div className='small'>
                                <a
                                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/block/countdown/${endingBlockNumber}`}
                                    target="_blank" rel="noreferrer"
                                >
                                    {
                                        isEndingBlockLoading ? (
                                            <div className='d-flex justify-content-start'>
                                                <Spin size='small' />
                                            </div>
                                        ) : (
                                            <>
                                                <NumberFormat
                                                    displayType='text'
                                                    decimalScale={0}
                                                    thousandSeparator={true}
                                                    value={cachedBlockNumber ? cachedBlockNumber : 0}
                                                    suffix={' ' + t('Blocks')}
                                                />
                                                <Clock size={12} />
                                            </>
                                        )
                                    }

                                </a>
                            </div>
                        </div>

                        <div className='text-end small'>
                            <a href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${stakedTokenDetails?.tokenAddress}`}
                                target="_blank" rel="noreferrer"
                            >{t('See Token Info')} <ExternalLink size={12} /></a>
                        </div>

                        <div className='text-end small'>
                            {
                                poolData?.projectSiteURL &&
                                <a href={poolData?.projectSiteURL} target="_blank" rel="noreferrer">
                                    {t('View Project Site')} <ExternalLink size={12} />
                                </a>
                            }

                        </div>

                        <div className='text-end small'>
                            <a href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${poolData?.stakingPoolAddress}`}
                                target="_blank" rel="noreferrer">{t('View Contract')} <ExternalLink size={12} /></a>
                        </div>

                        {
                            account &&
                            <AddToMetamaskButton poolData={poolData} />
                        }
                    </div>
                </Collapse>
            </Card>

            {/* ROI Calculator modal */}
            <RoiCalculator
                poolData={poolData}
                isROICalculatorVisible={isROICalculatorVisible}
                setIsROICalculatorVisible={setIsROICalculatorVisible}
                stakedTokenName={poolData?.stakingTokenName}
                stakedTokenDetails={stakedTokenDetails}
                aprPercentage={aprPercentage}
                stakingPoolAddress={poolData?.stakingPoolAddress}
            />

            <StakingModel
                stakingPoolAddress={poolData?.stakingPoolAddress}
                stakedTokenDetails={stakedTokenDetails}
                userStakedDetails={userStakedDetails}
                isStakingAmountModelVisible={isStakingAmountModelVisible}
                setIsStakingAmountModelVisible={setIsStakingAmountModelVisible}
                userStakingAmount={userStakingAmount}
                setUserStakingAmount={setUserStakingAmount}
                setIsForceRefreshData={setIsForceRefreshData}
            />

            <UnstakeTokenModal
                stakingPoolAddress={poolData?.stakingPoolAddress}
                userStakedDetails={userStakedDetails}
                stakedTokenDetails={stakedTokenDetails}
                rewardsTokenAddress={poolData?.rewardsTokenAddress}
                isUnStakingAmountModelVisible={isUnStakingAmountModelVisible}
                setIsUnStakingAmountModelVisible={setIsUnStakingAmountModelVisible}
                userStakingAmount={userStakingAmount}
                setUserStakingAmount={setUserStakingAmount}
                setIsForceRefreshData={setIsForceRefreshData}
            />

        </div>
    )
}

export default StakingWidget