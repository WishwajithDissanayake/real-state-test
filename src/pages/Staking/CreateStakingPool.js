import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import {
    Card,
    Checkbox,
    Input,
    Form,
    DatePicker,
    Button,
    Alert,
    Spin,
    notification,
    Upload
} from 'antd'
import { useTranslation } from 'react-i18next';
import WAValidator from 'wallet-address-validator'
import { useWeb3React } from '@web3-react/core';
import {
    getERC20TokenDataByTokenAddress,
    getERC20TokenBalanceByWalletAddress,
    floor10
} from '../../Blockchain/services/common.service';
import millify from 'millify';
import { getWeb3PRovider } from '../../Blockchain/services/common.service';
import { DateTime } from 'luxon';
import NumberFormat from 'react-number-format';
import { utils } from 'ethers';
import {
    approveTokensForStaking,
    createStakingPoolWithRewardsToken,
    createStakingPoolWithoutRewardsToken
} from '../../Blockchain/services/staking.service';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import AWS from 'aws-sdk'
import {
    LinkOutlined,
    UploadOutlined
} from '@ant-design/icons'

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
    region: process.env.REACT_APP_REGION,
})

function CreateStakingPool() {

    const { account, library } = useWeb3React()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const [isSameAsStakedToken, setIsSameAsStakedToken] = useState(false)

    const [detailsVerified, setDetailsVerified] = useState(false)

    const [stakeTokenContractAddress, setStakeTokenContractAddress] = useState('')
    const [tokenValidationStatus, setTokenValidationStatus] = useState('')
    const [tokenValidationHelperMessage, setTokenValidationHelperMessage] = useState('')
    const [isUserTokenDetailsLoading, setIsUserTokenDetailsLoading] = useState(false)
    const [stakingTokenDetails, setStakingTokenDetails] = useState(null)
    const [userTokenBalance, setUserTokenBalance] = useState(0.0)
    const [isStakingTokenValid, setIsStakingTokenValid] = useState(false)

    const [rewardsTokenAddress, setRewardsTokenAddress] = useState('')
    const [rewardsTokenValidationStatus, setRewardsTokenValidationStatus] = useState('')
    const [rewardsTokenValidationMessage, setRewardsTokenValidationMessage] = useState('')
    const [rewardsTokenDetails, setRewardsTokenDetails] = useState(null)
    const [isRewardsTokenDetailsLoading, setIsRewardsTokenDetailsLoading] = useState(false)
    const [userRewardsTokenBalance, setUserRewardsTokenBalance] = useState(0.0)
    const [isRewardsTokenAddressValid, setIsRewardsTokenAddressValid] = useState(0.0)

    const [currentBlockNumber, setCurrentBlockNumber] = useState(0.0)
    const [blockCountToExpire, setBlockCountToExpire] = useState(0)

    const [rewardsSupplyValidationStatus, setRewardsSupplyValidationStatus] = useState('')
    const [rewardsSupplyValidationMessage, setRewardsSupplyValidationMessage] = useState('')

    const [rewardsSupply, setRewardsSupply] = useState(null)
    const [poolEndDate, setPoolEndDate] = useState(null)
    const [rewardsPerBlock, setRewardsPerBlock] = useState(0.0)
    const [stakerTimeClock, setStakerTimeClock] = useState(0)

    const [startBlockNumber, setStartBlockNumber] = useState(0)
    const [endBlockNumber, setEndBlockNumber] = useState(0)
    const [isStakingPoolCreateLoading, setIsStakingPoolCreateLoading] = useState(false)
    const [isStakingApprovalLoading, setIsStakingApprovalLoading] = useState(false)

    const [isPoolCreationDisabled, setIsPoolCreationDisabled] = useState(true)
    const [stakingLimitPerUser, setStakingLimitPerUser] = useState('')

    const [poolExpireDateString, setPoolExpireDateString] = useState('')
    const [poolExpireDateTimestamp, setPoolExpireDateTimestamp] = useState('')

    const [logoURLValidationMessage, setLogoURLValidationMessage] = useState(null)
    const [logoURLValidationStatus, setLogoURLValidationStatus] = useState(null)

    const [uploadedLogoFile, setUploadedLogoFile] = useState(null)
    const [isLogoUploading, setIsLogoUploading] = useState(false)
    const [logoURL, setLogoURL] = useState(null)

    const [projectURL, setProjectURL] = useState('')
    const [isApproveButtonDisabled, setIsApproveButtonDisabled] = useState(false)

    const key = 'updatable';

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setIsApproveButtonDisabled(false)
    }, [rewardsSupply, stakingLimitPerUser, poolEndDate, rewardsTokenAddress, stakeTokenContractAddress, stakerTimeClock, isSameAsStakedToken])

    const listenToBlockCreateEvent = async () => {
        const provider = getWeb3PRovider()
        provider.on('block', blockNumber => {
            if (currentBlockNumber !== blockNumber) {
                setCurrentBlockNumber(blockNumber)
            }
        })
    }

    const fetchCurrentBlockNumber = async () => {
        const provider = getWeb3PRovider()
        const blockNumber = await provider.getBlockNumber()
        setStartBlockNumber(blockNumber)
    }

    useEffect(() => {
        if (rewardsPerBlock) {
            fetchCurrentBlockNumber()
        }
    }, [rewardsPerBlock])

    useEffect(() => {
        listenToBlockCreateEvent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (
            rewardsTokenAddress &&
            stakeTokenContractAddress &&
            rewardsPerBlock !== '' &&
            rewardsSupply !== '' &&
            stakingLimitPerUser !== '' &&
            stakerTimeClock >= 0) {
            setDetailsVerified(true)
        } else {
            setDetailsVerified(false)
        }
    }, [rewardsTokenAddress, stakeTokenContractAddress, rewardsPerBlock, rewardsSupply, stakerTimeClock, stakingLimitPerUser])

    useEffect(() => {
        if (rewardsSupply && startBlockNumber && endBlockNumber) {
            const blockCount = parseInt(endBlockNumber) - parseInt(startBlockNumber)
            const rewardsPerBlockResponse = parseFloat(rewardsSupply) / blockCount
            setRewardsPerBlock(rewardsPerBlockResponse)
        } else {
            setRewardsPerBlock('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockCountToExpire, startBlockNumber, endBlockNumber, rewardsSupply])

    useEffect(() => {
        setIsPoolCreationDisabled(true)
    }, [rewardsSupply])

    const isValidImageURL = (url) => {
        try {
            var regExp = /^https?:\/\/.*\/.*\.(jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG)\??.*$/gmi
            if (url.match(regExp)) {
                return true;
            }
        } catch (error) {
            return false
        }
        // return (url.match(/(?:https?:\/\/)?\.(jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG)$/) != null)
    }

    useEffect(() => {
        if (logoURL) {
            if (isValidImageURL(logoURL)) {
                setLogoURLValidationStatus('success')
                setLogoURLValidationMessage(null)
                setIsPoolCreationDisabled(false)
            } else {
                setLogoURLValidationStatus('error')
                setLogoURLValidationMessage(t("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setIsPoolCreationDisabled(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoURL])

    // to handle same as staked token option
    const handleSameAsStakedToken = (e) => {

        setIsSameAsStakedToken(e.target.checked)
        // if true, set token address data and metadata as same as staked token
        if (e.target.checked) {
            setRewardsTokenValidationStatus('success')
            setRewardsTokenValidationMessage('')
            setRewardsTokenAddress(stakeTokenContractAddress)
            setRewardsTokenDetails(stakingTokenDetails)
        } else {
            setRewardsTokenValidationStatus('')
            setRewardsTokenValidationMessage('')
            setRewardsTokenAddress('')
            setRewardsTokenDetails(null)
        }
    }

    // handle date change
    const onChangeDate = async (date, dateString) => {

        const AVG_BLOCK_TIME_IN_SECONDS = 3
        const currentTimestamp = DateTime.now().toSeconds()
        const selectedDateTimestamp = DateTime.fromFormat(dateString, 'yyyy-LL-dd', { zone: 'utc' })
            .toSeconds()

        setPoolExpireDateTimestamp(selectedDateTimestamp)
        setPoolExpireDateString(dateString)
        const provider = getWeb3PRovider()
        const currentBlockNumber = await provider.getBlockNumber()
        setStartBlockNumber(currentBlockNumber)
        const secondsToPoolExpire = parseInt(selectedDateTimestamp) - parseInt(currentTimestamp)
        if (secondsToPoolExpire > 0) {
            const numbersOfBlockCount = parseInt(secondsToPoolExpire / AVG_BLOCK_TIME_IN_SECONDS)
            setBlockCountToExpire(numbersOfBlockCount)
            const endBlock = parseInt(currentBlockNumber) + numbersOfBlockCount
            setEndBlockNumber(endBlock)
        } else {
            setStartBlockNumber(0)
            setEndBlockNumber(0)
            setBlockCountToExpire(0)
        }
        setPoolEndDate(date)
    };

    const handleStakeTokenContractAddress = async (e) => {
        const stakeTokenAddress = e.target.value
        setStakeTokenContractAddress(stakeTokenAddress)
        const isValidAddress = WAValidator.validate(stakeTokenAddress, 'ETH')
        if (isValidAddress) {
            setTokenValidationStatus('success')
            setTokenValidationHelperMessage('')
            setIsStakingTokenValid(true)
        } else {
            setTokenValidationStatus('error')
            const validationMessage = t('Please enter the valid token address')
            setTokenValidationHelperMessage(validationMessage)
            setIsStakingTokenValid(false)
        }
    }

    const handleRewardsTokenAddress = (e) => {
        const rewardsTokenAddressResponse = e.target.value
        const isValidAddress = WAValidator.validate(rewardsTokenAddressResponse, 'ETH')
        if (isValidAddress) {
            setRewardsTokenValidationStatus('success')
            setRewardsTokenValidationMessage('')
            setIsRewardsTokenAddressValid(true)
        } else {
            setRewardsTokenValidationStatus('error')
            const validationMessage = t('Please enter the valid token address')
            setRewardsTokenValidationMessage(validationMessage)
            setIsRewardsTokenAddressValid(false)
        }
        setRewardsTokenAddress(rewardsTokenAddressResponse)
    }

    const fetchStakingTokenDetails = async () => {
        try {
            setIsUserTokenDetailsLoading(true)
            setTokenValidationStatus('validating')
            if (account) {
                setTokenValidationHelperMessage(null)
                const tokenDataResponse = await getERC20TokenDataByTokenAddress(stakeTokenContractAddress)
                const userTokenBalance = await getERC20TokenBalanceByWalletAddress(stakeTokenContractAddress, account)
                setUserTokenBalance(userTokenBalance)
                setStakingTokenDetails(tokenDataResponse)
                setIsUserTokenDetailsLoading(false)
                setTokenValidationStatus('success')
            } else {
                const validationMessage = t('Please connect your wallet to fetch the balance')
                setTokenValidationHelperMessage(validationMessage)
                setTokenValidationStatus('error')
                setStakingTokenDetails(null)
                setUserTokenBalance(0.0)
                setIsUserTokenDetailsLoading(false)
            }
        } catch (error) {
            console.log("ERROR while fetching user token details for staking pool creation")
            const validationMessage = t('Something went wrong while fetching token details')
            setTokenValidationHelperMessage(validationMessage)
            setTokenValidationStatus('error')
            setIsUserTokenDetailsLoading(false)
            setStakingTokenDetails(null)
            setUserTokenBalance(0.0)
        }
    }

    const fetchRewardsTokenDetails = async () => {
        try {
            setIsRewardsTokenDetailsLoading(true)
            setRewardsTokenValidationStatus('validating')
            if (account) {
                setRewardsTokenValidationMessage(null)
                const rewardsTokenDataResponse = await getERC20TokenDataByTokenAddress(rewardsTokenAddress)
                const userRewardsTokenBalance = await getERC20TokenBalanceByWalletAddress(rewardsTokenAddress, account)
                setUserRewardsTokenBalance(userRewardsTokenBalance)
                setRewardsTokenDetails(rewardsTokenDataResponse)
                setIsRewardsTokenDetailsLoading(false)
                setRewardsTokenValidationStatus('success')
            } else {
                const validationMessage = t('Please connect your wallet to fetch the balance')
                setRewardsTokenValidationMessage(validationMessage)
                setRewardsTokenValidationStatus('error')
                setRewardsTokenDetails(null)
                setUserRewardsTokenBalance(0.0)
                setIsRewardsTokenDetailsLoading(false)
            }
        } catch (error) {
            console.log("ERROR while fetching user token details for staking pool creation")
            const validationMessage = t('Something went wrong while fetching token details')
            setRewardsTokenValidationMessage(validationMessage)
            setRewardsTokenValidationStatus('error')
            setIsRewardsTokenDetailsLoading(false)
            setRewardsTokenDetails(null)
            setUserRewardsTokenBalance(0.0)
        }
    }

    useEffect(() => {
        if (isStakingTokenValid) {
            fetchStakingTokenDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeTokenContractAddress, account])

    useEffect(() => {
        if (isStakingTokenValid) {
            fetchRewardsTokenDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rewardsTokenAddress, account, isSameAsStakedToken])

    useEffect(() => {

        if (stakeTokenContractAddress && rewardsTokenAddress) {
            if (stakeTokenContractAddress?.toLowerCase() === rewardsTokenAddress?.toLowerCase()) {
                setIsSameAsStakedToken(true)
            } else {
                setIsSameAsStakedToken(false)
            }
        } else {
            setIsSameAsStakedToken(false)
        }


    }, [stakeTokenContractAddress, rewardsTokenAddress])

    const handleRewardsAmount = (e) => {
        const rewardsAmount = e.target.value

        if (parseFloat(rewardsAmount) > parseFloat(userRewardsTokenBalance)) {
            const validationMessage = t('You can not exceeds the current rewards token balance of your wallet')
            setRewardsSupplyValidationMessage(validationMessage)
            setRewardsSupplyValidationStatus('error')
            setRewardsSupply(userRewardsTokenBalance)
        } else {
            setRewardsSupply(rewardsAmount)
            setRewardsSupplyValidationStatus('success')
            setRewardsSupplyValidationMessage('')
        }
    }

    const onFinish = (values) => {
        console.log(values)
    }

    const handleCreateStakingPool = async () => {
        setIsStakingPoolCreateLoading(true)
        try {
            if (!account) {
                notification['error']({
                    key,
                    message: t('Authentication Error'),
                    description:
                        t('Please connect your wallet to proceed'),
                })
                setIsStakingPoolCreateLoading(false)
                return
            }
            const SECONDS_PER_DAY = 86400
            const rewardsTokenDecimals = parseInt(rewardsTokenDetails?.tokenDecimals)

            const expoFloor = rewardsTokenDecimals - 3
            const rewardsFloorValue = floor10(rewardsPerBlock, -expoFloor)
            const rewardsPerBlockFormatted = utils.parseUnits(rewardsFloorValue.toFixed(rewardsTokenDecimals), rewardsTokenDecimals)
            const stakingLimitPerUserFormatted = utils.parseUnits(stakingLimitPerUser, rewardsTokenDecimals)
            const lockTimeInDays = parseInt(stakerTimeClock) * SECONDS_PER_DAY
            const totalRewardsSupplyFormatted = utils.parseUnits(rewardsSupply.toString(), rewardsTokenDecimals)

            if (!isSameAsStakedToken) {
                const result = await createStakingPoolWithRewardsToken(
                    stakeTokenContractAddress,
                    rewardsTokenAddress,
                    startBlockNumber,
                    endBlockNumber,
                    stakingLimitPerUserFormatted,
                    lockTimeInDays,
                    totalRewardsSupplyFormatted,
                    rewardsTokenDecimals,
                    library.getSigner()
                )
                console.log("RESULT staking pool creation success ", result)
                if (result) {
                    const stakingPoolCreationLog = result.logs[0]
                    const payload = JSON.stringify({
                        "transactionHash": result.transactionHash,
                        "blockNumber": result.blockNumber,
                        "stakingPoolAddress": stakingPoolCreationLog.address,
                        "stakingTokenAddress": stakeTokenContractAddress,
                        "rewardsTokenAddress": rewardsTokenAddress,
                        "rewardsTokenDecimals": rewardsTokenDetails?.tokenDecimals,
                        "stakingTokenDecimals": stakingTokenDetails?.tokenDecimals,
                        "stakingTokenName": stakingTokenDetails?.tokenName,
                        "stakingTokenSymbol": stakingTokenDetails?.tokenSymbol,
                        "rewardsTokenName": rewardsTokenDetails?.tokenName,
                        "rewardsTokenSymbol": rewardsTokenDetails?.tokenSymbol,
                        "isRewardsSameAsStakingToken": isSameAsStakedToken,
                        "rewardsSupply": totalRewardsSupplyFormatted.toString(),
                        "stakingTokensPerUser": stakingLimitPerUserFormatted.toString(),
                        "poolExpireDate": poolExpireDateString,
                        "poolExpireTimestamp": poolExpireDateTimestamp,
                        "rewardsPerBlock": rewardsPerBlockFormatted ? rewardsPerBlockFormatted.toString() : '',
                        "stakeTimeLockInDays": lockTimeInDays,
                        "startBlockNumber": startBlockNumber,
                        "createdByAddress": account,
                        "endBlockNumber": endBlockNumber,
                        "status": "live",
                        "logoUrl": logoURL,
                        "tokenLockFor": lockTimeInDays,
                        "projectSiteURL": projectURL,
                        "aprUpdatedAt": DateTime.now().toISO().toString(),
                    })

                    const config = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/staking/create`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: payload
                    }

                    const apiResponse = await axios(config)
                    console.log("RESULT API RESPONSE ", apiResponse.data)
                    notification['success']({
                        key,
                        message: t('Transaction Success'),
                        description: 'Staking pool has been created',
                    })
                    navigate('/pool-portal')
                }
            } else {
                const result = await createStakingPoolWithoutRewardsToken(
                    stakeTokenContractAddress,
                    startBlockNumber,
                    endBlockNumber,
                    stakingLimitPerUserFormatted,
                    lockTimeInDays,
                    totalRewardsSupplyFormatted,
                    rewardsTokenDecimals,
                    library.getSigner()
                )
                console.log("RESULT staking pool creation success ", result)
                if (result) {
                    const stakingPoolCreationLog = result.logs[0]
                    const payload = JSON.stringify({
                        "transactionHash": result.transactionHash,
                        "blockNumber": result.blockNumber,
                        "stakingPoolAddress": stakingPoolCreationLog.address,
                        "stakingTokenAddress": stakeTokenContractAddress,
                        "rewardsTokenAddress": rewardsTokenAddress,
                        "rewardsTokenDecimals": rewardsTokenDetails?.tokenDecimals,
                        "stakingTokenDecimals": stakingTokenDetails?.tokenDecimals,
                        "stakingTokenName": stakingTokenDetails?.tokenName,
                        "stakingTokenSymbol": stakingTokenDetails?.tokenSymbol,
                        "rewardsTokenName": rewardsTokenDetails?.tokenName,
                        "rewardsTokenSymbol": rewardsTokenDetails?.tokenSymbol,
                        "isRewardsSameAsStakingToken": isSameAsStakedToken,
                        "rewardsSupply": totalRewardsSupplyFormatted.toString(),
                        "stakingTokensPerUser": stakingLimitPerUserFormatted.toString(),
                        "poolExpireDate": poolExpireDateString,
                        "poolExpireTimestamp": poolExpireDateTimestamp,
                        "rewardsPerBlock": rewardsPerBlockFormatted.toString() ? rewardsPerBlockFormatted.toString() : '',
                        "stakeTimeLockInDays": lockTimeInDays,
                        "startBlockNumber": startBlockNumber,
                        "createdByAddress": account,
                        "endBlockNumber": endBlockNumber,
                        "status": "live",
                        "logoUrl": logoURL,
                        "tokenLockFor": lockTimeInDays,
                        "projectSiteURL": projectURL,
                        "aprUpdatedAt": DateTime.now().toISO().toString(),
                    })

                    const config = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/staking/create`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: payload
                    }

                    const apiResponse = await axios(config)
                    console.log("RESULT API RESPONSE ", apiResponse.data)
                    notification['success']({
                        key,
                        message: t('Transaction Success'),
                        description: 'Staking pool has been created',
                    })
                    navigate('/pool-portal')
                }
            }
            setIsStakingPoolCreateLoading(false)
        } catch (error) {
            notification['error']({
                key,
                message: t('Transaction Execution Failed'),
                description: error,
            })
            console.log("ERROR while trying to create the staking pool ", error)
            setIsStakingPoolCreateLoading(false)
        }
    }

    const handleApproveToken = async () => {
        setIsStakingApprovalLoading(true)
        try {
            if (!account) {
                notification['error']({
                    key,
                    message: t('Authentication Error'),
                    description:
                        t('Please connect your wallet to proceed'),
                });
                setIsStakingApprovalLoading(false)
                return
            }
            const decimalValue = parseInt(stakingTokenDetails?.tokenDecimals)
            const tokenAmountForApproval = utils.parseUnits(rewardsSupply.toString(), decimalValue)
            const result = await approveTokensForStaking(rewardsTokenAddress, tokenAmountForApproval, isSameAsStakedToken, library.getSigner())
            console.log("RESULT approval success ", result)
            if (result) {
                notification['success']({
                    key,
                    message: t('Transaction Success'),
                    description: 'Token has been approved for staking',
                })
                setIsStakingApprovalLoading(false)
            }
            setIsStakingApprovalLoading(false)
            setIsPoolCreationDisabled(false)
            setIsApproveButtonDisabled(true)
        } catch (error) {
            notification['error']({
                key,
                message: t('Transaction Execution Failed'),
                description: error,
            })
            console.log("ERROR while trying to approve the staking token ", error)
            setIsStakingApprovalLoading(false)
        }
    }

    const uploadConfigs = {
        onRemove: () => {
            setUploadedLogoFile(null)
            setLogoURL(null)
        },
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png'
            const isJPG = file.type === 'image/jpg'
            const isJPEG = file.type === 'image/jpeg'
            const isGIF = file.type === 'image/gif'

            if (isPNG || isJPG || isJPEG || isGIF) {
                let fileSize = file.size / 1024 / 1024; // in MiB
                console.log(fileSize)
                if (fileSize <= 5) {
                    setUploadedLogoFile(file)
                } else {
                    setUploadedLogoFile(null)
                    setLogoURL(null)
                    setLogoURLValidationStatus('error')
                    notification['error']({
                        key,
                        message: t('Invalid File Size'),
                        description:
                            t('Please select a file less than 5MB'),
                    })
                }
            } else {
                notification['error']({
                    key,
                    message: t('Invalid File Type'),
                    description:
                        t('Please upload .png, .jpg, .jpeg or .gif formats'),
                })
                return false
            }
            return false
        },
    }

    const uploadFileToAWS = () => {
        setLogoURLValidationStatus('validating')
        setLogoURL('')
        setIsLogoUploading(true)
        const params = {
            ACL: 'public-read',
            Body: uploadedLogoFile,
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: uploadedLogoFile.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                const progress = Math.round((evt.loaded / evt.total) * 100)
                console.log("Progress", progress)
            })
            .send((error, data) => {
                if (!error) {
                    const uploadedFileURI = `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/${uploadedLogoFile.name}`
                    console.log(uploadedFileURI)
                    setLogoURL(uploadedFileURI)
                    notification['success']({
                        key,
                        message: t('File Uploaded'),
                        description:
                            t('Logo has been uploaded'),
                    })
                    setLogoURLValidationMessage(null)
                    setLogoURLValidationStatus('success')
                    setIsLogoUploading(false)
                } else {
                    setLogoURLValidationStatus('error')
                    setLogoURL('')
                    setIsLogoUploading(false)
                }

            })
    }

    useEffect(() => {
        if (uploadedLogoFile) {
            uploadFileToAWS()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedLogoFile])


    return (
        <div className='col-lg-11 mx-auto mt-5 mb-5'>

            <Alert
                message={
                    <span>
                        <a
                            href="https://docs.kingsale.finance/how-to-use-kingsale/creating-a-staking-pool"
                            target="_blank"
                            rel="noreferrer">
                            {t('Click here')}
                        </a>
                        {t(' for instructions')}
                    </span>}
                type="warning"
                showIcon
                closable />

            <Form
                name="createStaking"
                onFinish={onFinish}
                initialValues={{
                    stakeTokenContractAddress: stakeTokenContractAddress,
                    rewardsTokenAddress: rewardsTokenAddress
                }}
            >
                <Row>
                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mt-3'>
                        <Card className='kingsale-card-bg h-100'>
                            <div className='d-flex justify-content-between'>
                                <h5>{t('Token Users will Stake')}</h5>
                            </div>

                            <span className='small'>{t('The token users can stake to earn rewards from the rewards pool you\'ve provided.')}</span>
                            <Form.Item
                                hasFeedback
                                validateStatus={tokenValidationStatus}
                                help={tokenValidationHelperMessage}
                                name="stakeTokenContractAddress"
                            >
                                <Input
                                    lang='en'
                                    className='mt-3'
                                    size="large"
                                    placeholder={t('Token Contract Address')}
                                    value={stakeTokenContractAddress}
                                    onChange={handleStakeTokenContractAddress}
                                />
                            </Form.Item>

                            {
                                isUserTokenDetailsLoading ? (
                                    <div className='d-flex justify-content-center'>
                                        <Spin size='medium' />
                                    </div>
                                ) : (

                                    isStakingTokenValid && !tokenValidationHelperMessage &&
                                    <div>
                                        <hr />

                                        <Row>
                                            <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                <h6>{t('Symbol')}</h6>
                                                <p className='fw-bold'>{stakingTokenDetails?.tokenSymbol}</p>
                                            </Col>

                                            <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                <h6>{t('Token')}</h6>
                                                <p className='fw-bold'>{stakingTokenDetails?.tokenName}</p>
                                            </Col>

                                            <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                <h6>{t('Balance')}</h6>
                                                <p className='fw-bold'>{userTokenBalance ? millify(parseFloat(userTokenBalance), { precision: 3, space: true }) : 0}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            }

                        </Card>
                    </Col>

                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mt-3'>
                        <Card className='kingsale-card-bg h-100'>
                            <div className='d-flex justify-content-between'>
                                <h5>{t('Rewards Token')}</h5>
                                <Checkbox className='my-auto' checked={isSameAsStakedToken} onChange={handleSameAsStakedToken}>
                                    {t('Same as token being staked')}
                                </Checkbox>
                            </div>

                            <span className='small'>{t('The token you will send the staking contract for users to earn for staking.')}</span>

                            <Form.Item
                                hasFeedback
                                validateStatus={rewardsTokenValidationStatus}
                                help={rewardsTokenValidationMessage}
                                name="rewardsTokenAddress"
                            >
                                <Input
                                    lang='en'

                                    className='mt-3'
                                    size="large"
                                    placeholder={t('Token Contract Address')}
                                    onChange={handleRewardsTokenAddress}
                                    value={rewardsTokenAddress}
                                    disabled={isSameAsStakedToken}

                                />
                            </Form.Item>

                            {
                                isSameAsStakedToken ? (
                                    isUserTokenDetailsLoading ? (
                                        <div className='d-flex justify-content-center'>
                                            <Spin size='medium' />
                                        </div>
                                    ) : (

                                        isStakingTokenValid && !tokenValidationHelperMessage &&
                                        <div>
                                            <hr />

                                            <Row>
                                                <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                    <h6>{t('Symbol')}</h6>
                                                    <p className='fw-bold'>{stakingTokenDetails?.tokenSymbol}</p>
                                                </Col>

                                                <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                    <h6>{t('Token')}</h6>
                                                    <p className='fw-bold'>{stakingTokenDetails?.tokenName}</p>
                                                </Col>

                                                <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                    <h6>{t('Balance')}</h6>
                                                    <p className='fw-bold'>{userTokenBalance ? millify(parseFloat(userTokenBalance), { precision: 3, space: true }) : 0}</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                ) : (
                                    isRewardsTokenDetailsLoading ? (
                                        <div className='d-flex justify-content-center'>
                                            <Spin size='medium' />
                                        </div>
                                    ) : (
                                        isRewardsTokenAddressValid && !rewardsTokenValidationMessage ? (
                                            <div>
                                                <hr />

                                                <Row>
                                                    <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                        <h6>{t('Symbol')}</h6>
                                                        <p className='fw-bold'>{rewardsTokenDetails?.tokenSymbol}</p>
                                                    </Col>

                                                    <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                        <h6>{t('Token')}</h6>
                                                        <p className='fw-bold'>{rewardsTokenDetails?.tokenName}</p>
                                                    </Col>

                                                    <Col xxl="4" xl="4" lg="4" md="4" sm="4" xs="4" className='text-center'>
                                                        <h6>{t('Balance')}</h6>
                                                        <p className='fw-bold'>
                                                            {userRewardsTokenBalance ? millify(parseFloat(userRewardsTokenBalance), { precision: 3, space: true }) : 0}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : (<></>)
                                    )
                                )
                            }
                        </Card>
                    </Col>
                </Row>

                <Row className='mt-4'>
                    <Col>
                        <Card className='kingsale-card-bg'>
                            <h5>{t('Pool Information')}</h5>

                            <div className='mt-4'>
                                <Row>

                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                        <span className='small'>{t('Logo URL')} <span className='required-field-warning'>*</span></span>
                                        <Form.Item
                                            name="logoURL"
                                            validateStatus={logoURLValidationStatus}
                                            help={logoURLValidationMessage}
                                            hasFeedback
                                            onChange={e => setLogoURL(e.target.value)}
                                        >
                                            <Input
                                                lang='en'
                                                disabled={isLogoUploading}
                                                value={logoURL}
                                                size="large"
                                                prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                                placeholder="Recommended logo size: 600x600 pixels"
                                            />
                                            <Upload {...uploadConfigs} maxCount={1} listType="picture" >
                                                <Button
                                                    style={{ marginTop: '10px' }}
                                                    // onClick={}
                                                    className='kingsale-primary-button'
                                                ><div className='d-flex'><UploadOutlined style={{ marginTop: '3px', marginRight: '4px' }} />Or Upload</div></Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>

                                    <Col>
                                        <span className='small'>{t('Rewards Supply (#tokens)')}</span>
                                        <Form.Item
                                            hasFeedback
                                            help={rewardsSupplyValidationMessage}
                                            validateStatus={rewardsSupplyValidationStatus}
                                        >
                                            <Input
                                                lang='en'
                                                size="large"
                                                value={rewardsSupply}
                                                disabled={!rewardsTokenAddress || isRewardsTokenDetailsLoading}
                                                onChange={handleRewardsAmount}
                                                placeholder={t("Rewards Supply (#tokens)")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <span className='small'>{t('Staking Limit Per User (#tokens)')}</span>
                                        <Form.Item
                                            hasFeedback
                                        >
                                            <Input
                                                lang='en'
                                                size="large"
                                                value={stakingLimitPerUser}
                                                disabled={!rewardsTokenAddress}
                                                onChange={e => setStakingLimitPerUser(e.target.value)}
                                                placeholder={t("Set staking limit per user (#tokens)")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                                        <span className='small'>{t('When should pool expire?')}</span>
                                        <Form.Item>
                                            <DatePicker
                                                value={poolEndDate}
                                                onChange={onChangeDate}
                                                disabled={!rewardsTokenAddress}
                                                className="col-12"
                                                placeholder={t('Approximate pool end date')}
                                                size="large"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                                        <span className='small'>{t('Rewards per block')} ~
                                            <span className='muted small'>
                                                {t(' current Block #')} {currentBlockNumber}
                                            </span>
                                        </span>
                                        <Form.Item>
                                            <Input
                                                lang='en'
                                                placeholder={t('Rewards per block')}
                                                size="large"
                                                disabled={true}
                                                value={rewardsPerBlock}
                                                onChange={(e) => setRewardsPerBlock(e.target.value)}
                                                type="number"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <span className='small'>{t('Stake Timelock (in days)')}</span>
                                        <Form.Item
                                            hasFeedback
                                        >
                                            <Input
                                                lang='en'
                                                type="number"
                                                size="large"
                                                disabled={!rewardsTokenAddress}
                                                value={stakerTimeClock}
                                                onChange={(e) => setStakerTimeClock(e.target.value)}
                                                placeholder={t("Minimum number of days user should stake (default: 0)")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <span className='small'>{t('Project URL')}</span>
                                        <Form.Item
                                            hasFeedback
                                        >
                                            <Input
                                                lang='en'
                                                size="large"
                                                value={projectURL}
                                                disabled={!rewardsTokenAddress}
                                                onChange={(e) => setProjectURL(e.target.value)}
                                                placeholder={t("Enter your project URL")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>

            {
                detailsVerified &&
                <Row className='mt-4'>
                    <Col>
                        <Card className='kingsale-card-bg'>
                            <h5>{t('Create New Pool!')}</h5>

                            <ol>
                                <li>{t('Your new pool will require users to stake')} <span className='fw-bold'>{stakingTokenDetails?.tokenSymbol} ({stakingTokenDetails?.tokenName})</span> and will require
                                    {t(' users with')} <span className='fw-bold'>{rewardsTokenDetails?.tokenSymbol} ({rewardsTokenDetails?.tokenName})</span></li>

                                <li>{t('Your pool will reward')} <span className='fw-bold'><NumberFormat
                                    value={rewardsPerBlock}
                                    displayType="text"
                                    suffix={' ' + rewardsTokenDetails?.tokenSymbol}
                                /></span> per block across all users in the pool until <span className='fw-bold'>{rewardsSupply} {rewardsTokenDetails?.tokenSymbol}</span> {t('have been rewarded in total.')}</li>

                                <li>{t('Your pool rewards will expire approximately on date')} <span className='fw-bold'>
                                    {poolEndDate ? poolEndDate.format('yyyy-MM-DD') : ''}
                                </span></li>

                                <li>{t('Your pool will require users to stake their tokens a minimum of')} <span className='fw-bold'>{stakerTimeClock} {t('days')}</span> {t('before they can unstake them.')}</li>
                            </ol>

                            <div className='text-center'>
                                <Button
                                    loading={isStakingApprovalLoading}
                                    onClick={handleApproveToken}
                                    disabled={isApproveButtonDisabled}
                                    style={{ marginRight: '5px' }}
                                    size="large"
                                    className='kingsale-primary-button'>
                                    {t('Approve Tokens')}
                                </Button>
                                <Button
                                    loading={isStakingPoolCreateLoading}
                                    onClick={handleCreateStakingPool}
                                    disabled={isPoolCreationDisabled}
                                    size="large"
                                    className='kingsale-primary-button'>
                                    {t('Create New Pool')}
                                </Button>
                            </div>

                            <div className='col-8 mx-auto text-center mt-3'>
                                <span>{t('You will spend')} <span className='fw-bold'></span> {t('to create this new pool.')}</span>
                                <br />
                                <span>{t('It will not cost anything for users to stake their tokens in your pool.')}</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
            }

        </div >
    )
}

export default CreateStakingPool