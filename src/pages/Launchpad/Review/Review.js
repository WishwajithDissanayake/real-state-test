import React, { useState, useEffect } from 'react'
import { Button, notification, Spin } from 'antd'
import { Row, Col } from 'reactstrap'
import TokenMetadata from './TokenMetadata'
import DexListingDetails from './DexListingDetails'
import VestingDetails from './VestingDetails'
import SocialDetails from './SocialDetails'
import { useWeb3React } from '@web3-react/core'
import {
    getPresaleTokenFeePercentage,
    approveTokens,
    approveTokensForBEP20,
    createNewPresaleWithBNB,
    createNewPresaleWithBEP20
} from '../../../Blockchain/services/presale.service'
import { utils } from 'ethers'
import { DateTime } from 'luxon'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

function Review(props) {

    const { t } = useTranslation();
    const {
        tokenAddress,
        totalTokenNeeded,
        tokenSymbol,
        tokenName,
        tokenDecimals,
        liquidityProvider,
        tokensPerBNB,
        launchRate,
        liquidityTokenName,
        liquidityToken,
        softCap,
        hardCap,
        setStepNumberParent,
        projectName,
        minimumBuy,
        maximumBuy,
        liquidityPercentage,
        startTime,
        endTime,
        isWhitelistingEnabled,
        liquidityUnlockTime,
        publicStartTime,
        logoURL,
        coverImageUrl,
        website,
        facebookLink,
        twitterLink,
        githubLink,
        telegramLink,
        instagramLink,
        discordLink,
        redditLink,
        description,
        isVestingEnabled,
        initialTokenReleasePercentage,
        vestingCyclesInDays,
        tokenReleasePercentageInCycle,
        youtubeLink,
        kycLink,
        auditedLink,
        safuLink,
        poocoinLink,
        isLiquidityBurn

    } = props

    const [isPoolCreateDisabled, setIsPoolCreateDisabled] = useState(true)
    const [isTokenApprovalLoading, setIsTokenApprovalLoading] = useState(false)

    const [isPresalePoolCreationLoading, setIsPresalePoolCreationLoading] = useState(false)
    const [isApproveButtonDisabled, setIsApproveButtonDisabled] = useState(false)

    const { account, library } = useWeb3React()
    const navigate = useNavigate()

    const key = 'updatable';

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleApproveToken = async () => {
        setIsTokenApprovalLoading(true)
        setIsPoolCreateDisabled(true)
        try {

            if (!account) {
                notification['error']({
                    key,
                    message: t('Authentication Error'),
                    description:
                        t('Please connect your wallet to proceed'),
                });
                setIsTokenApprovalLoading(false)
                return
            }
            const tokenFeePercentage = await getPresaleTokenFeePercentage()
            const tokenFeeNumber = parseFloat(tokenFeePercentage)
            const totalNumbersOfTokenWithoutFee = parseFloat(hardCap) * parseFloat(tokensPerBNB)
            const tokensConsumedByFee = (tokenFeeNumber / 100) * totalNumbersOfTokenWithoutFee
            const tokensAmountWithFee = totalNumbersOfTokenWithoutFee + tokensConsumedByFee

            //calculate launch rate tokens
            const liquidityBNB = (parseFloat(liquidityPercentage) / 100) * parseFloat(hardCap)
            const tokensNeedForLaunch = parseFloat(liquidityBNB) * parseFloat(launchRate)
            const cumulativeTokenNeeded = tokensAmountWithFee + tokensNeedForLaunch

            const decimals = parseInt(tokenDecimals)
            const tokenToBeApproved = cumulativeTokenNeeded.toFixed(decimals)
            const actualAmountForApproval = utils.parseUnits(tokenToBeApproved.toString(), decimals)
            if (liquidityTokenName === "BNB") {
                const result = await approveTokens(tokenAddress, actualAmountForApproval, library.getSigner())
                console.log("TOKEN APPROVAL RESULT ", result)
                if (result) {
                    notification['success']({
                        key,
                        message: t('Success'),
                        description: t('Token Approval Success, Please proceed to presale creation.'),
                    })
                }
                setIsPoolCreateDisabled(false)

            } else {
                const result = await approveTokensForBEP20(tokenAddress, actualAmountForApproval, library.getSigner())
                console.log("TOKEN APPROVAL RESULT ", result)
                if (result) {
                    notification['success']({
                        key,
                        message: t('Success'),
                        description: t('Token Approval Success, Please proceed to presale creation.'),
                    })
                }
                setIsPoolCreateDisabled(false)
            }
            setIsTokenApprovalLoading(false)
            setIsApproveButtonDisabled(true)

        } catch (error) {
            notification['error']({
                key,
                message: t('Transaction Execution Failed'),
                description: error,
            })
            setIsPoolCreateDisabled(true)
            setIsTokenApprovalLoading(false)
            console.log("ERROR while approving tokens for pool creation", error)
        }
    }

    const handlePresalePoolCreate = async () => {
        setIsPresalePoolCreationLoading(true)
        try {

            if (!account) {
                notification['error']({
                    key,
                    message: t('Authentication Error'),
                    description:
                        t('Please connect your wallet to proceed'),
                });
                setIsPresalePoolCreationLoading(false)
                return
            }
            const SECONDS_PER_DAY = 86400

            const _tokenAddress = utils.getAddress(tokenAddress)
            const _router = utils.getAddress(liquidityProvider)
            const _startTime = DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
            const _endTime = DateTime.fromFormat(endTime, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
            const _lockPercentage = liquidityPercentage.toString()
            const _liquidityUnlockTimeInSeconds = parseInt(liquidityUnlockTime) * SECONDS_PER_DAY

            const _softCap = utils.parseEther(softCap.toString()).toString()
            const _hardCap = utils.parseEther(hardCap.toString()).toString()
            const _minimumBuyAmount = utils.parseEther(minimumBuy.toString()).toString()
            const _maximumBuyAmount = utils.parseEther(maximumBuy.toString()).toString()

            const decimals = parseInt(tokenDecimals)
            const _tokensPerBnb = utils.parseUnits(tokensPerBNB.toString(), decimals)
            const _launchRate = utils.parseUnits(launchRate.toString(), decimals)
            const totalTokensAmountCal = parseFloat(hardCap) * parseFloat(tokensPerBNB)
            const totalTokenAmountForPoolCreation = totalTokensAmountCal.toFixed(tokenDecimals)
            const _totalTokensAmount = utils.parseUnits(totalTokenAmountForPoolCreation.toString(), tokenDecimals)

            const _initialReleasePercentage = initialTokenReleasePercentage ? parseFloat(initialTokenReleasePercentage).toString() : '0'
            const _releaseCycleInDays = vestingCyclesInDays ? (parseInt(vestingCyclesInDays) * SECONDS_PER_DAY).toString() : '0'
            const _releasePercentage = tokenReleasePercentageInCycle ? parseInt(tokenReleasePercentageInCycle).toString() : '0'

            let _publicSaleStart = 0
            if (isWhitelistingEnabled) {
                _publicSaleStart = DateTime.fromFormat(publicStartTime, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
            }

            if (liquidityTokenName === "BNB") {
                const _poolDetailsArray = [
                    _startTime.toString(),
                    _endTime.toString(),
                    _hardCap,
                    _tokensPerBnb,
                    _totalTokensAmount,
                    _minimumBuyAmount,
                    _maximumBuyAmount,
                    _lockPercentage,
                    _liquidityUnlockTimeInSeconds, // lp unlock time in days should be in seconds
                    _launchRate,
                    _softCap
                ]

                const _vestingDetailsArray = [
                    _initialReleasePercentage,
                    _releaseCycleInDays,
                    _releasePercentage
                ]
                const result = await createNewPresaleWithBNB(
                    [_tokenAddress, _router],
                    _poolDetailsArray,
                    _vestingDetailsArray,
                    isWhitelistingEnabled,
                    _publicSaleStart,
                    isLiquidityBurn,
                    library.getSigner()
                )
                console.log("PRESALE CREATE RESULT ", result)

                const poolAddress = result?.events[0]?.address
                //if private sale contract creation success save data into the database
                const payload = {
                    "poolContractAddress": poolAddress,
                    "presaleName": projectName,
                    "tokenAddress": tokenAddress,
                    "tokenName": tokenName,
                    "tokenSymbol": tokenSymbol,
                    "tokenDecimals": tokenDecimals,
                    "tokensPerBNB": _tokensPerBnb.toString(),
                    "totalTokenAmount": _totalTokensAmount.toString(),
                    "minimumBuy": _minimumBuyAmount,
                    "maximumBuy": _maximumBuyAmount,
                    "softCap": _softCap,
                    "hardCap": _hardCap,
                    "launchRate": _launchRate.toString(),
                    "liquidityUnlockTimestamp": _liquidityUnlockTimeInSeconds,
                    "routerAddress": liquidityProvider,
                    "startTime": startTime,
                    "endTime": endTime,
                    "startTimeTimestamp": _startTime,
                    "endTimeTimestamp": _endTime,
                    "liquidityTokenName": liquidityTokenName,
                    "liquidityTokenAddress": liquidityToken,
                    "liquidityPercentage": liquidityPercentage,
                    "isInvestorVestingEnable": isVestingEnabled,
                    "initialTokenReleasePercentage": initialTokenReleasePercentage ? initialTokenReleasePercentage : null,
                    "vestingPeriodInDays": vestingCyclesInDays ? vestingCyclesInDays : null,
                    "cycleTokenReleasePercentage": tokenReleasePercentageInCycle ? tokenReleasePercentageInCycle : null,
                    "logoURL": logoURL,
                    "coverImageUrl": coverImageUrl,
                    "websiteLink": website,
                    "facebookLink": facebookLink,
                    "twitterLink": twitterLink,
                    "githubLink": githubLink,
                    "telegramLink": telegramLink,
                    "instagramLink": instagramLink,
                    "discordLink": discordLink,
                    "redditLink": redditLink,
                    "description": description,
                    "poolOwner": account,
                    "isWhiteListingEnabled": isWhitelistingEnabled,
                    "publicSaleStartTimestamp": _publicSaleStart,
                    "youTubeLink": youtubeLink,
                    "kycLink": kycLink,
                    "auditedLink": auditedLink,
                    "safuLink": safuLink,
                    "pooCoinLink": poocoinLink
                }

                let config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/create`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload)
                };

                const apiResponse = await axios(config)
                console.log("API RESULT ", apiResponse.data)

                if (result) {
                    notification['success']({
                        key,
                        message: t('Success'),
                        description: t('Presale has been created.'),
                    })

                    navigate('/my-presales')
                }
                setIsPresalePoolCreationLoading(false)
                setIsPoolCreateDisabled(true)
            } else {
                const _poolDetailsArray = [
                    _startTime.toString(),
                    _endTime.toString(),
                    _hardCap,
                    _tokensPerBnb,
                    _totalTokensAmount,
                    _minimumBuyAmount,
                    _maximumBuyAmount,
                    _lockPercentage,
                    _liquidityUnlockTimeInSeconds, //lock time in days should be in seconds
                    _launchRate,
                    _softCap
                ]

                const _vestingDetailsArray = [
                    _initialReleasePercentage,
                    _releaseCycleInDays,
                    _releasePercentage
                ]

                const _addressList = [
                    _tokenAddress,
                    liquidityToken,
                    _router
                ]

                const result = await createNewPresaleWithBEP20(
                    _poolDetailsArray,
                    _vestingDetailsArray,
                    isWhitelistingEnabled,
                    _publicSaleStart,
                    _addressList,
                    isLiquidityBurn,
                    library.getSigner()
                )
                console.log("PRESALE CREATE WITH BEP 20 RESULT ", result)

                const poolAddress = result?.events[0]?.address
                //if private sale contract creation success save data into the database
                const payload = {
                    "poolContractAddress": poolAddress,
                    "presaleName": projectName,
                    "tokenAddress": tokenAddress,
                    "tokenName": tokenName,
                    "tokenSymbol": tokenSymbol,
                    "tokenDecimals": tokenDecimals,
                    "tokensPerBNB": _tokensPerBnb.toString(),
                    "totalTokenAmount": _totalTokensAmount.toString(),
                    "minimumBuy": _minimumBuyAmount,
                    "maximumBuy": _maximumBuyAmount,
                    "softCap": _softCap,
                    "hardCap": _hardCap,
                    "launchRate": _launchRate.toString(),
                    "liquidityUnlockTimestamp": _liquidityUnlockTimeInSeconds,
                    "routerAddress": liquidityProvider,
                    "startTime": startTime,
                    "endTime": endTime,
                    "startTimeTimestamp": _startTime,
                    "endTimeTimestamp": _endTime,
                    "liquidityTokenName": liquidityTokenName,
                    "liquidityTokenAddress": liquidityToken,
                    "liquidityPercentage": liquidityPercentage,
                    "isInvestorVestingEnable": isVestingEnabled,
                    "initialTokenReleasePercentage": initialTokenReleasePercentage ? initialTokenReleasePercentage : null,
                    "vestingPeriodInDays": vestingCyclesInDays ? vestingCyclesInDays : null,
                    "cycleTokenReleasePercentage": tokenReleasePercentageInCycle ? tokenReleasePercentageInCycle : null,
                    "logoURL": logoURL,
                    "coverImageUrl": coverImageUrl,
                    "websiteLink": website,
                    "facebookLink": facebookLink,
                    "twitterLink": twitterLink,
                    "githubLink": githubLink,
                    "telegramLink": telegramLink,
                    "instagramLink": instagramLink,
                    "discordLink": discordLink,
                    "redditLink": redditLink,
                    "description": description,
                    "poolOwner": account,
                    "isWhiteListingEnabled": isWhitelistingEnabled,
                    "publicSaleStartTimestamp": _publicSaleStart,
                    "youTubeLink": youtubeLink,
                    "kycLink": kycLink,
                    "auditedLink": auditedLink,
                    "safuLink": safuLink,
                    "pooCoinLink": poocoinLink
                }

                let config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/create`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload)
                };

                const apiResponse = await axios(config)
                console.log("API RESULT ", apiResponse.data)

                if (result) {
                    notification['success']({
                        key,
                        message: t('Success'),
                        description: t('Presale has been created.'),
                    })

                    navigate('/my-presales')
                }
                setIsPresalePoolCreationLoading(false)
                setIsPoolCreateDisabled(true)
            }

        } catch (error) {
            setIsPresalePoolCreationLoading(false)
            console.log("ERROR while creating presale pool ", error)
            notification['error']({
                key,
                message: t('Transaction Execution Failed'),
                description: error,
            })

        }
    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 18,
                color: '#fff',
            }}
            spin
        />
    );

    return (
        <div className='review-info-area'>

            {/* Token Metadata component */}
            <TokenMetadata
                projectName={projectName}
                totalTokenNeeded={totalTokenNeeded}
                tokenName={tokenName}
                tokenSymbol={tokenSymbol}
                tokenDecimals={tokenDecimals}
            />

            {/* DexListing Details component */}
            <DexListingDetails
                liquidityProvider={liquidityProvider}
                tokensPerBNB={tokensPerBNB}
                tokenSymbol={tokenSymbol}
                launchRate={launchRate}
                softCap={softCap}
                liquidityTokenName={liquidityTokenName}
                hardCap={hardCap}
                minimumBuy={minimumBuy}
                maximumBuy={maximumBuy}
                liquidityPercentage={liquidityPercentage}
                startTime={startTime}
                endTime={endTime}
                liquidityUnlockTime={liquidityUnlockTime}
                isWhitelistingEnabled={isWhitelistingEnabled}
                publicStartTime={publicStartTime}
            />

            {/* Vesting Details component */}
            <VestingDetails
                isVestingEnabled={isVestingEnabled}
                initialTokenReleasePercentage={initialTokenReleasePercentage}
                vestingCyclesInDays={vestingCyclesInDays}
                tokenReleasePercentageInCycle={tokenReleasePercentageInCycle}
            />

            {/* Social Details component */}
            <SocialDetails
                logoURL={logoURL}
                coverImageUrl={coverImageUrl}
                website={website}
                facebookLink={facebookLink}
                twitterLink={twitterLink}
                githubLink={githubLink}
                telegramLink={telegramLink}
                instagramLink={instagramLink}
                discordLink={discordLink}
                redditLink={redditLink}
                youtubeLink={youtubeLink}
                description={ReactHtmlParser(description)}
                kycLink={kycLink}
                auditedLink={auditedLink}
                safuLink={safuLink}
                poocoinLink={poocoinLink}
            />

            <Row>
                <Col lg="12" md="12" sm="12" className='text-center'>
                    <Button onClick={() => setStepNumberParent(2)} style={{ marginRight: '5px' }} className="mt-3">Go Back</Button>

                    {
                        !isTokenApprovalLoading &&
                        <Button
                            className="mt-3"
                            onClick={handleApproveToken}
                            disabled={isApproveButtonDisabled}
                            style={{ marginRight: '5px' }}
                            type="primary">{t('Approve Tokens')}
                        </Button>
                    }

                    {
                        isTokenApprovalLoading &&
                        <Button
                            className="mt-3"
                            style={{ marginRight: '5px' }}
                            type="primary"><Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />{t('Approve Tokens')}
                        </Button>
                    }

                    {
                        !isPresalePoolCreationLoading &&
                        <Button
                            className='mt-3'
                            onClick={handlePresalePoolCreate}
                            disabled={isPoolCreateDisabled}
                            type="primary">{t('Create Presale')}
                        </Button>
                    }

                    {
                        isPresalePoolCreationLoading &&
                        <Button
                            className='mt-3'
                            disabled={isPoolCreateDisabled}
                            type="primary"><Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />
                            Create Presale
                        </Button>
                    }


                </Col>
            </Row>
        </div>
    )
}

export default Review