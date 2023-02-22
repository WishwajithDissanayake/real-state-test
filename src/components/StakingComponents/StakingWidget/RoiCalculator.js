import React, { useEffect, useState } from 'react'
import { Modal, Card, Input, Tag, Button, Radio, Checkbox, Spin } from 'antd'
import { Row, Col } from 'reactstrap';
import { ArrowDown, Edit2, Check } from 'react-feather'
import { SwapOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next';
import {
    getInterestBreakdown,
    getPrincipalForInterest,
    getRoi,
    roiCalculatorRewardsTokenDetails
} from '../../../Blockchain/services/staking.service';
import NumberFormat from 'react-number-format';
import { getERC20TokenBalanceByWalletAddress } from '../../../Blockchain/services/common.service';
import StakingDisclaimer from './StakingDisclaimer';

function RoiCalculator(props) {

    const {
        stakingPoolAddress,
        aprPercentage,
        isROICalculatorVisible,
        stakedTokenName,
        stakedTokenDetails,
        poolData,
        setIsROICalculatorVisible } = props
    const { t } = useTranslation();
    const [reverseCalculate, setReverseCalculate] = useState(false)
    const [changeRoiValue, setChangeRoiValue] = useState(false)
    const [kingsaleStakedUsd, setKingsaleStakedUsd] = useState(0)
    const [kingsaleStake, setKingsaleStake] = useState(0)
    const [roiUsdValue, setRoiUsdValue] = useState(0)

    const [stakedFor, setStakedFor] = useState('0')
    const [compoundingEvery, setCompoundingEevry] = useState('1')
    const [compoundingEveryChecked, setCompoundingEveryChecked] = useState(true)

    const [rewardsTokenDetails, setRewardsTokenDetails] = useState(null)
    const [isRewardsTokenDetailsLoading, setIsRewardsTokenDetailsLoading] = useState(false)
    const [principalAmountInUSD, setPrincipalAmountInUSD] = useState(0.0)
    const [roiValuePercentage, setRoiValuePercentage] = useState(0)
    const [estimatedRewardsTokenAmount, setEstimatedRewardsTokenAmount] = useState(0)

    const [isUserStakedTokenBalanceLoading, setIsUserStakedTokenBalanceLoading] = useState(false)

    const web3React = useWeb3React()
    const { account } = web3React

    const fetchRewardsTokenDetails = async () => {
        try {
            setIsRewardsTokenDetailsLoading(true)
            const rewardsTokenResponse = await roiCalculatorRewardsTokenDetails(stakingPoolAddress)
            setRewardsTokenDetails(rewardsTokenResponse)
            setIsRewardsTokenDetailsLoading(false)
        } catch (error) {
            setIsRewardsTokenDetailsLoading(false)
            setRewardsTokenDetails(null)
            console.log("ERROR while fetching rewards token details ", error)
        }
    }

    useEffect(() => {
        fetchRewardsTokenDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakingPoolAddress])

    // calculation when changing usd value
    const handleKingsaleStakeUsd = (value) => {
        setKingsaleStakedUsd(value)
        setPrincipalAmountInUSD(value)
        if (rewardsTokenDetails && rewardsTokenDetails.tokenPrice) {
            const tokenPriceInUSD = parseFloat(rewardsTokenDetails.tokenPrice)
            const rewardsTokenAmountForGivenUSD = parseFloat(value) / tokenPriceInUSD
            setKingsaleStake(rewardsTokenAmountForGivenUSD)
        }
    }

    // calculation when changing reverse
    const handleKingsaleStake = (value) => {
        setKingsaleStake(value)
        if (rewardsTokenDetails && rewardsTokenDetails.tokenPrice) {
            const tokenPriceInUSD = parseFloat(rewardsTokenDetails.tokenPrice)
            const usdValueForGivenTokenAmount = parseFloat(value) * tokenPriceInUSD
            setKingsaleStakedUsd(usdValueForGivenTokenAmount)
            setPrincipalAmountInUSD(usdValueForGivenTokenAmount)
        }
    }

    // calculation when roi value change
    const handleCalculationFromRoiValue = (value) => {

        const stakedForIndex = parseInt(stakedFor)
        const APR = parseFloat(aprPercentage).toFixed(6)
        const principalForExpectedRoi = getPrincipalForInterest(
            parseFloat(value),
            parseFloat(APR),
            !compoundingEveryChecked ? compoundingEvery : 0,
            0,
        )
        const principalUSD = !Number.isNaN(principalForExpectedRoi[stakedForIndex])
            ? principalForExpectedRoi[stakedForIndex]
            : 0

        setPrincipalAmountInUSD(principalUSD)
        setKingsaleStakedUsd(principalUSD)
        const roiValue = getRoi({
            amountEarned: parseFloat(value),
            amountInvested: parseFloat(principalUSD),
        })
        setRoiValuePercentage(roiValue)

        if (rewardsTokenDetails && rewardsTokenDetails.tokenPrice && kingsaleStakedUsd) {
            const tokenPriceInUSD = parseFloat(rewardsTokenDetails.tokenPrice)
            const rewardsTokenAmountForGivenUSD = parseFloat(kingsaleStakedUsd) / tokenPriceInUSD
            setKingsaleStake(rewardsTokenAmountForGivenUSD)
        }
    }

    // reset all the values on swap button click
    const handleSwapButton = () => {
        setReverseCalculate(!reverseCalculate)
    }

    useEffect(() => {

        const rewardTokenPrice = parseFloat(rewardsTokenDetails?.tokenPrice).toFixed(12)
        const usdAmount = parseFloat(principalAmountInUSD).toFixed(6)
        const APR = parseFloat(aprPercentage).toFixed(6)
        const interestBreakdown = getInterestBreakdown({
            principalInUSD: parseFloat(usdAmount),
            apr: parseFloat(APR),
            earningTokenPrice: parseFloat(rewardTokenPrice),
            compoundFrequency: !compoundingEveryChecked ? parseFloat(compoundingEvery) : 0,
            performanceFee: 0,
        })

        const stakedForIndex = parseInt(stakedFor)
        const hasInterest = !Number.isNaN(interestBreakdown[stakedForIndex])
        const roiTokens = hasInterest ? interestBreakdown[stakedForIndex] : 0
        const roiAsUSD = hasInterest ? roiTokens * rewardTokenPrice : 0
        let roiValue = 0
        if (hasInterest) {
            roiValue = getRoi({
                amountEarned: roiAsUSD,
                amountInvested: parseFloat(usdAmount),
            })
        } else {
            roiValue = 0
        }

        const roiValueAsPercentage = roiValue / 100
        setRoiValuePercentage(roiValue)
        const estimatedROIEarningInUSD = parseFloat(usdAmount) * roiValueAsPercentage
        setRoiUsdValue(estimatedROIEarningInUSD)

        const estimatedRewardsTokenAmount = parseFloat(estimatedROIEarningInUSD) / rewardTokenPrice
        setEstimatedRewardsTokenAmount(estimatedRewardsTokenAmount)
    }, [
        aprPercentage,
        rewardsTokenDetails,
        principalAmountInUSD,
        stakedFor,
        compoundingEvery,
        compoundingEveryChecked
    ])

    const handleMyBalance = async () => {
        setIsUserStakedTokenBalanceLoading(true)
        try {
            const tokenBalanceResponse = await getERC20TokenBalanceByWalletAddress(stakedTokenDetails?.tokenAddress, account)
            setKingsaleStake(tokenBalanceResponse)
            setIsUserStakedTokenBalanceLoading(false)

            if (rewardsTokenDetails && rewardsTokenDetails.tokenPrice) {
                const tokenPriceInUSD = parseFloat(rewardsTokenDetails.tokenPrice)
                const usdValueForGivenTokenAmount = parseFloat(tokenBalanceResponse) * tokenPriceInUSD
                setKingsaleStakedUsd(usdValueForGivenTokenAmount)
                setPrincipalAmountInUSD(usdValueForGivenTokenAmount)
            }

        } catch (error) {
            setIsUserStakedTokenBalanceLoading(false)
            setKingsaleStake(0.0)
            console.log("ERROR while fetching user staked token balance", error)
        }
    }

    return (
        <Modal
            title={t("ROI Calculator")}
            visible={isROICalculatorVisible}
            onOk={() => setIsROICalculatorVisible(false)}
            onCancel={() => setIsROICalculatorVisible(false)}
            footer={false}>
            <div>
                <span className='primary-text'>{stakedTokenName} Staked</span>
                <Card className='kingsale-card-bg'>
                    <Row>
                        <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="9">
                            {
                                reverseCalculate ?
                                    <>
                                        <Input
                                            lang='en'
                                            type="number"
                                            suffix={<Tag>{rewardsTokenDetails?.tokenName}</Tag>}
                                            value={kingsaleStake ? parseFloat(kingsaleStake) : ''}
                                            onChange={(e) => handleKingsaleStake(e.target.value)} placeholder="0.00" />
                                        <Input
                                            lang='en'
                                            type="number"
                                            suffix={<Tag>USD</Tag>}
                                            placeholder="0.00"
                                            value={kingsaleStakedUsd ? parseFloat(kingsaleStakedUsd).toFixed(4) : ''}
                                            className='mt-2'
                                            disabled={true} />
                                    </>
                                    :
                                    <>
                                        <Input
                                            lang='en'
                                            type="number"
                                            suffix={<Tag>USD</Tag>}
                                            placeholder="0.00"
                                            value={kingsaleStakedUsd ? parseFloat(kingsaleStakedUsd) : ''}
                                            onChange={(e) => handleKingsaleStakeUsd(e.target.value)} />
                                        <Input
                                            lang='en'
                                            type="number"
                                            suffix={<Tag>{rewardsTokenDetails?.tokenName}</Tag>}
                                            value={kingsaleStake ? parseFloat(kingsaleStake).toFixed(4) : ''}
                                            placeholder="0.00"
                                            className='mt-2'
                                            disabled={true} />
                                    </>
                            }

                        </Col>

                        <Col className='my-auto'>
                            {
                                isRewardsTokenDetailsLoading || isUserStakedTokenBalanceLoading ? (
                                    <div className='d-flex'>
                                        <Spin size='small' />
                                    </div>
                                ) : (
                                    <Button
                                        type="text"
                                        onClick={() => handleSwapButton()}>
                                        <SwapOutlined style={{ transform: 'rotate(90deg)' }} />
                                    </Button>
                                )
                            }

                        </Col>
                    </Row>
                </Card>

                <div className='mt-3'>
                    <Row>
                        <Col xxl="3" xl="3" lg="3" md="3" sm="3" xs="3">
                            <Button size='small' className='kingsale-primary-button w-100' onClick={() => handleKingsaleStakeUsd(100)}>$100</Button>
                        </Col>

                        <Col xxl="3" xl="3" lg="3" md="3" sm="3" xs="3">
                            <Button size='small' className='kingsale-primary-button w-100' onClick={() => handleKingsaleStakeUsd(1000)}>$1000</Button>
                        </Col>

                        <Col xxl="5" xl="5" lg="5" md="5" sm="5" xs="5">
                            {/* on a click event, account balance should added as kingsaleStakedUsd value */}
                            <Button
                                loading={isUserStakedTokenBalanceLoading}
                                onClick={handleMyBalance}
                                size='small'
                                className='kingsale-primary-button w-100'
                                disabled={!account}>{t('My Balance')}</Button>
                        </Col>

                        <Col xxl="1" xl="1" lg="1" md="1" sm="1" xs="1">
                            {/* <Tooltip title={t("“My Balance” here includes both BREWLABS in your wallet, and BREWLABS already staked in this pool.")}>
                                <HelpCircle size={18} color="#e6bd4f" />
                            </Tooltip> */}
                        </Col>
                    </Row>
                </div>

                <div className='mt-4'>
                    <span className='primary-text'>{t('Staked For')}</span>

                    <div className='mt-2'>
                        <Radio.Group size="small" className='col-12' value={stakedFor} onChange={(e) => setStakedFor(e.target.value)}>
                            <div className='d-flex'>
                                <Col className='text-center'>
                                    <Radio.Button value="0" className='col-12'>1D</Radio.Button>
                                </Col>

                                <Col className='text-center'>
                                    <Radio.Button value="1" className='col-12'>7D</Radio.Button>
                                </Col>

                                <Col className='text-center'>
                                    <Radio.Button value="2" className='col-12'>30D</Radio.Button>
                                </Col>

                                <Col className='text-center'>
                                    <Radio.Button value="3" className='col-12'>1Y</Radio.Button>
                                </Col>

                                <Col className='text-center'>
                                    <Radio.Button value="4" className='col-12'>5Y</Radio.Button>
                                </Col>
                            </div>
                        </Radio.Group>
                    </div>
                </div>

                <div className='mt-4'>
                    <span className='primary-text'>{t('Compounding Every')}</span>

                    <div className='mt-2'>
                        <div className='d-flex justify-content-between'>
                            <div className='mx-auto'>
                                <Checkbox
                                    onChange={() => setCompoundingEveryChecked(!compoundingEveryChecked)} />
                            </div>

                            <Radio.Group
                                className='col-10'
                                size='small'
                                value={compoundingEvery}
                                disabled={compoundingEveryChecked}
                                onChange={(e) => setCompoundingEevry(e.target.value)}>
                                <div className='d-flex'>
                                    <Col className='text-center' style={{ margin: '2px' }}>
                                        <Radio.Button value="1" className='col-12'>1D</Radio.Button>
                                    </Col>

                                    <Col className='text-center' style={{ margin: '2px' }}>
                                        <Radio.Button value="0.142857142" className='col-12'>7D</Radio.Button>
                                    </Col>

                                    <Col className='text-center' style={{ margin: '2px' }}>
                                        <Radio.Button value="0.033333333" className='col-12'>30D</Radio.Button>
                                    </Col>
                                </div>
                            </Radio.Group>
                        </div>
                    </div>
                </div>

                <div className='mt-3 text-center'>
                    <ArrowDown />
                </div>

                <Card className='kingsale-card-bg mt-3'>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <p className='primary-text'>{t('ROI At Current Rates')}</p>
                            {
                                changeRoiValue ?
                                    <Input
                                        lang='en'
                                        prefix="$"
                                        size="large"
                                        onChange={(e) => handleCalculationFromRoiValue(e.target.value)} />
                                    :
                                    <h4>
                                        <NumberFormat
                                            displayType='text'
                                            value={roiUsdValue}
                                            decimalScale={4}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </h4>
                            }
                            <span className='small'>
                                <NumberFormat
                                    displayType='text'
                                    value={estimatedRewardsTokenAmount ? estimatedRewardsTokenAmount : 0}
                                    decimalScale={4}
                                    thousandSeparator={true}
                                    prefix="~"
                                    suffix={rewardsTokenDetails?.tokenName}
                                />
                                <span style={{ marginLeft: '2px' }}>
                                    (
                                    <NumberFormat
                                        displayType='text'
                                        value={roiValuePercentage}
                                        decimalScale={3}
                                        suffix="%"
                                    />
                                    )
                                </span>
                            </span>
                        </div>

                        <div className='my-auto'>
                            {
                                changeRoiValue ?
                                    <Button type="text" onClick={() => setChangeRoiValue(false)}><Check /></Button>
                                    :
                                    <Button type="text" onClick={() => setChangeRoiValue(true)}><Edit2 /></Button>

                            }

                        </div>
                    </div>
                </Card>

                {
                    poolData?.stakingTokenAddress === poolData?.rewardsTokenAddress &&
                    <StakingDisclaimer />
                }

            </div>
        </Modal>
    )
}

export default RoiCalculator