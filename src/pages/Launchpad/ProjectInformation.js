import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Select,
  Alert
} from 'antd'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { preSaleConfigs } from '../../Blockchain/configs/presale.config'
import { getPresaleTokenFeePercentage } from '../../Blockchain/services/presale.service'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';

function ProjectInformation(props) {

  const { t } = useTranslation();

  const {
    setStepNumberParent,
    projectName,
    tokensPerBNB,
    setTokensPerBNB,
    setProjectName,
    minimumBuy,
    setMinimumBuy,
    maximumBuy,
    setMaximumBuy,
    softCap,
    setSoftCap,
    hardCap,
    setHardCap,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isWhitelistingEnabled,
    setIsWhitelistingEnabled,
    publicStartTime,
    setPublicStartTime,
    isVestingEnabled,
    setIsVestingEnabled,
    initialTokenReleasePercentage,
    setInitialTokenReleasePercentage,
    vestingCyclesInDays,
    setVestingCyclesInDays,
    tokenReleasePercentageInCycle,
    setTokenReleasePercentageInCycle,
    liquidityPercentage,
    setLiquidityPercentage,
    liquidityUnlockTime,
    setLiquidityUnlockTime,
    launchRate,
    setLaunchRate,
    liquidityProvider,
    setLiquidityProvider,
    tokenSymbol,
    liquidityTokenName,
    userTokenBalance,
    setTotalTokenNeeded,
    isLiquidityBurn,
    setIsLiquidityBurn
  } = props

  const [softCapHardCapValidationStatus, setSoftCapHardCapValidationStatus] = useState(null)
  const [softCapHardCapValidationMessage, setSoftCapHardCapValidationMessage] = useState(null)
  const [minMaxBuyValidationStatus, setMinMaxBuyValidationStatus] = useState(null)
  const [minMaxBuyValidationMessage, setMinMaxBuyValidationMassage] = useState(null)
  const [liquidityLockValidationStatus, setLiquidityLockValidationStatus] = useState(null)
  const [liquidityLockValidationMessage, setLiquidityLockValidationMessage] = useState(null)
  const [launchRateValidationStatus, setLaunchRateValidationStatus] = useState(null)
  const [launchRateValidationMessage, setLaunchRateValidationMessage] = useState(null)
  const [tokenFeePercentage, setTokenFeePercentage] = useState(0.0)
  const [minimumTokenNeedsForPoolCreation, setMinimumTokenNeedsForPoolCreation] = useState(0.0)
  const [isUserHaveEnoughTokensToProceed, setIsUserHaveEnoughTokensToProceed] = useState(false)
  const [userTokenBalanceValidationMessage, setUserTokenBalanceValidationMessage] = useState('')
  const [canProceedToNextStep, setCanProceedToNextStep] = useState(false)

  const [liquidityUnlockValidationStatus, setLiquidityUnlockValidationStatus] = useState(null)
  const [liquidityUnlockValidationMessage, setLiquidityUnlockValidationMessage] = useState(null)

  const [startDateValidationStatus, setStartDateValidationStatus] = useState(null)
  const [startDateValidationMessage, setStartDateValidationMessage] = useState(null)

  const [endDateValidationStatus, setEndDateValidationStatus] = useState(null)
  const [endDateValidationMessage, setEndDateValidationMessage] = useState(null)

  const [publicStartValidationStatus, setPublicStartValidationStatus] = useState(null)
  const [publicStartValidationMessage, setPublicStartValidationMessage] = useState(null)

  const [initialTokenReleasePercentageStatus, setInitialTokenReleasePercentageStatus] = useState(null)
  const [initialTokenReleasePercentageMessage, setInitialTokenReleasePercentageMessage] = useState(null)


  const isPublicStartTimeValid = true

  const [everyFieldFilled, setEveryFieldFilled] = useState(false)

  const { liquidityProviders } = preSaleConfigs
  const { Option } = Select

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const onChangeStartDate = (value, dateString) => {
    // comparison with the end time and public sale start time
    if (endTime && moment(dateString).isSameOrAfter(endTime)) {
      setStartDateValidationStatus('error')
      setStartDateValidationMessage('Start Time should be less than End Time')
      setCanProceedToNextStep(false)
    } else if (publicStartTime && moment(dateString).isAfter(publicStartTime)) {
      setStartDateValidationStatus('error')
      setStartDateValidationMessage('Start time cannot be greater than Public Sale Start Time')
      setCanProceedToNextStep(false)
    } else {
      setStartTime(dateString)
      setStartDateValidationStatus('success')
      setStartDateValidationMessage(null)
      setCanProceedToNextStep(true)
    }
  }

  const onChangeEndDate = (value, dateString) => {
    // comparison with start time and public sale start time
    if (startTime && moment(dateString).isSameOrBefore(startTime)) {
      setEndDateValidationStatus('error')
      setEndDateValidationMessage('End Time should be greater than Start Time')
      setCanProceedToNextStep(false)
    } else if (publicStartTime && moment(dateString).isSameOrBefore(publicStartTime)) {
      setEndDateValidationStatus('error')
      setEndDateValidationMessage('End Time should be greater than Public Sale Start Time')
      setCanProceedToNextStep(false)
    } else {
      setEndTime(dateString)
      setEndDateValidationStatus('success')
      setEndDateValidationMessage(null)
      setCanProceedToNextStep(true)
    }
  }

  const onChangePublicStartTime = (value, dateString) => {
    // comparison with start time and end time
    if (startTime && moment(dateString).isBefore(startTime)) {
      setPublicStartValidationStatus('error')
      setPublicStartValidationMessage('Public Sale Start Time cannot be less than Start Time')
      setCanProceedToNextStep(false)
    } else if (endTime && moment(dateString).isSameOrAfter(endTime)) {
      setPublicStartValidationStatus('error')
      setPublicStartValidationMessage('Public Sale Start Time should be less than End Time')
      setCanProceedToNextStep(false)
    } else {
      setPublicStartTime(dateString)
      setPublicStartValidationStatus(null)
      setPublicStartValidationMessage(null)
      setCanProceedToNextStep(true)
    }
  }

  const handleLiquidityBurn = (isChecked) => {
    if (isChecked) {
      setIsLiquidityBurn(isChecked)
      setLiquidityUnlockTime(0)
      setLiquidityUnlockValidationStatus('success')
      setLiquidityUnlockValidationMessage('')
      setCanProceedToNextStep(true)
    } else {
      setIsLiquidityBurn(false)
    }
  }

  const handleLiquidityProviderChange = (value) => {
    setLiquidityProvider(value)
  }

  const onFinish = (values) => {
    setStepNumberParent(2)
    console.log(values)
  }

  const fetchPresaleTokenFeePercentage = async () => {
    try {
      const tokenFeePercentageResponse = await getPresaleTokenFeePercentage()
      setTokenFeePercentage(tokenFeePercentageResponse)
    } catch (error) {
      setTokenFeePercentage(0.0)
      console.log("ERROR while fetching token fee percentage")
    }
  }

  useEffect(() => {
    fetchPresaleTokenFeePercentage()
  }, [])


  useEffect(() => {
    if (isLiquidityBurn) {
      setLiquidityUnlockTime(0)
      setLiquidityUnlockValidationStatus('success')
      setLiquidityUnlockValidationMessage('')
      setCanProceedToNextStep(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLiquidityBurn])

  useEffect(() => {
    if (liquidityUnlockTime) {
      if ((parseInt(liquidityUnlockTime) < 30)) {
        const message = t('Liquidity unlock time must be grater than 30 days')
        setLiquidityUnlockValidationStatus('error')
        setLiquidityUnlockValidationMessage(message)
        setCanProceedToNextStep(false)
      } else {
        setLiquidityUnlockValidationStatus('success')
        setLiquidityUnlockValidationMessage('')
        setCanProceedToNextStep(true)
      }

    } else {
      if (!isLiquidityBurn) {
        const message = t('Please enter the liquidity unlock days')
        setLiquidityUnlockValidationStatus('error')
        setLiquidityUnlockValidationMessage(message)
        setCanProceedToNextStep(false)
      } else {
        setLiquidityUnlockValidationStatus('success')
        setLiquidityUnlockValidationMessage('')
        setCanProceedToNextStep(true)
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityUnlockTime, isLiquidityBurn])


  useEffect(() => {
    if (tokenFeePercentage && hardCap && tokensPerBNB && liquidityPercentage && launchRate) {
      const tokenFeeNumber = parseFloat(tokenFeePercentage)
      const totalNumbersOfTokenWithoutFee = parseFloat(hardCap) * parseFloat(tokensPerBNB)
      const tokensConsumedByFee = (tokenFeeNumber / 100) * totalNumbersOfTokenWithoutFee
      const tokensAmountWithFee = totalNumbersOfTokenWithoutFee + tokensConsumedByFee

      //calculate launch rate tokens
      const liquidityBNB = (parseFloat(liquidityPercentage) / 100) * parseFloat(hardCap)
      const tokensNeedForLaunch = parseFloat(liquidityBNB) * parseFloat(launchRate)
      const cumulativeTokenNeeded = tokensAmountWithFee + tokensNeedForLaunch
      setMinimumTokenNeedsForPoolCreation(cumulativeTokenNeeded)
      setTotalTokenNeeded(cumulativeTokenNeeded)
    } else {
      setTotalTokenNeeded(0.0)
      setMinimumTokenNeedsForPoolCreation(0.0)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardCap, launchRate, tokensPerBNB, tokenFeePercentage, liquidityPercentage])

  useEffect(() => {
    if (parseFloat(userTokenBalance) < parseFloat(minimumTokenNeedsForPoolCreation)) {
      setIsUserHaveEnoughTokensToProceed(false)
      const errorMessage = `Seems like you don't have enough token to proceed the presale! 
      please check your input parameters and token balance! Your current balance is ${userTokenBalance}`
      setUserTokenBalanceValidationMessage(errorMessage)
    } else {
      setIsUserHaveEnoughTokensToProceed(true)
      setUserTokenBalanceValidationMessage('')
    }
  }, [userTokenBalance, minimumTokenNeedsForPoolCreation])

  useEffect(() => {

    if (parseFloat(hardCap) === 0 || parseFloat(softCap) === 0) {
      setSoftCapHardCapValidationMessage(t('Hard cap and Soft cap can not be zero'))
      setSoftCapHardCapValidationStatus('error')
      setCanProceedToNextStep(false)
    } else {
      if (parseFloat(hardCap) >= (2 * parseFloat(softCap))) {
        setSoftCapHardCapValidationMessage(null)
        setSoftCapHardCapValidationStatus('success')
        setCanProceedToNextStep(true)
      } else {
        setSoftCapHardCapValidationMessage(t('Hard cap should be 2 times higher than soft cap'))
        setSoftCapHardCapValidationStatus('error')
        setCanProceedToNextStep(false)
      }
    }



  }, [softCap, hardCap, t])

  useEffect(() => {
    if (parseFloat(minimumBuy) >= parseFloat(maximumBuy)) {
      setMinMaxBuyValidationMassage(t('Minimum buy amount can not be grate than maximum buy amount'))
      setMinMaxBuyValidationStatus('error')
      setCanProceedToNextStep(false)
    } else {
      setMinMaxBuyValidationMassage(null)
      setMinMaxBuyValidationStatus('success')
      setCanProceedToNextStep(true)
    }

  }, [minimumBuy, maximumBuy, t])

  useEffect(() => {

    if (50 < parseFloat(liquidityPercentage) && parseFloat(liquidityPercentage) <= 100) {
      setLiquidityLockValidationMessage(null)
      setLiquidityLockValidationStatus("success")
      setCanProceedToNextStep(true)
    } else {
      setLiquidityLockValidationMessage(t("Liquidity lock percentage should be within 51% ~ 100%"))
      setLiquidityLockValidationStatus("error")
      setCanProceedToNextStep(false)
    }

  }, [liquidityPercentage, t])

  useEffect(() => {
    if (launchRate) {
      if (parseFloat(launchRate) > parseFloat(tokensPerBNB)) {
        setLaunchRateValidationMessage(t("Launch rate should be less than presale rate"))
        setLaunchRateValidationStatus("error")
        setCanProceedToNextStep(false)
      } else {
        setLaunchRateValidationMessage(null)
        setLaunchRateValidationStatus("success")
        setCanProceedToNextStep(true)
      }
    } else {
      const message = t("Please enter the valid amount for launch rate")
      setLaunchRateValidationMessage(message)
      setLaunchRateValidationStatus("error")
      setCanProceedToNextStep(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchRate])

  useEffect(() => {
    if (initialTokenReleasePercentage && initialTokenReleasePercentage <= 100) {
      setInitialTokenReleasePercentageStatus('success')
      setInitialTokenReleasePercentageMessage(null)
    } else {
      setInitialTokenReleasePercentageStatus('error')
      const message = t('Token release percentage can not exceed 100%')
      setInitialTokenReleasePercentageMessage(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTokenReleasePercentage])

  useEffect(() => {
    if (
      projectName &&
      tokensPerBNB &&
      minimumBuy &&
      maximumBuy &&
      softCap &&
      hardCap &&
      startTime &&
      endTime &&
      liquidityPercentage &&
      liquidityUnlockTime &&
      launchRate
    ) {
      setEveryFieldFilled(true)
    } else {
      setEveryFieldFilled(false)
    }
  }, [])

  const validateFormsInputForProceed = () => {
    const isTokenNameFilled = projectName !== ''
    const isTokenPerBNBFilled = parseFloat(tokensPerBNB) > 0
    const isValidMinimBuyAmount = parseFloat(minimumBuy) > 0 && minMaxBuyValidationStatus === 'success'
    const isValidMaximumBuyAmount = parseFloat(maximumBuy) > 0 && minMaxBuyValidationStatus === 'success'
    const isValidSoftCapValue = parseFloat(softCap) >= 0 && softCapHardCapValidationStatus === 'success'
    const isValidHardCapValue = parseFloat(hardCap) >= 0 && softCapHardCapValidationStatus === 'success'
    const isValidStartTime = startTime !== '' && startDateValidationStatus === 'success'
    const isValidEndTime = endTime !== '' && endDateValidationStatus === 'success'
    const isValidLiquidityPercentage = parseFloat(liquidityPercentage) > 50 && liquidityLockValidationStatus === 'success'
    const isValidLiquidityUnlockDays = parseFloat(liquidityUnlockTime) >= 0 && liquidityUnlockValidationStatus === 'success'
    const isValidLaunchRate = parseFloat(launchRate) > 0 && launchRateValidationStatus === 'success'
    const isValidLiquidityProvider = liquidityProvider !== ''
    let isValidPublicStartTime = false
    if (isWhitelistingEnabled && publicStartTime !== '' && isPublicStartTimeValid) {
      isValidPublicStartTime = true
    }
    if (!isWhitelistingEnabled) {
      isValidPublicStartTime = true
    }
    let isValidTokenReleasePercentage = true
    let isValidVestingPeriod = true
    let isValidTokenReleasePerEachCycle = true
    if (isVestingEnabled) {
      if (!parseInt(initialTokenReleasePercentage) > 0) {
        isValidTokenReleasePercentage = false
      } else {
        isValidTokenReleasePercentage = true
      }

      if (!parseInt(vestingCyclesInDays) > 0) {
        isValidVestingPeriod = false
      } else {
        isValidVestingPeriod = true
      }

      if (!parseInt(tokenReleasePercentageInCycle) > 0) {
        isValidTokenReleasePerEachCycle = false
      } else {
        isValidTokenReleasePerEachCycle = true
      }
    }

    if (
      isTokenNameFilled &&
      isTokenPerBNBFilled &&
      isValidMinimBuyAmount &&
      isValidMaximumBuyAmount &&
      isValidSoftCapValue &&
      isValidHardCapValue &&
      isValidStartTime &&
      isValidEndTime &&
      isValidLiquidityPercentage &&
      isValidLiquidityUnlockDays &&
      isValidLaunchRate &&
      isValidLiquidityProvider &&
      isValidPublicStartTime &&
      isValidTokenReleasePercentage &&
      isValidVestingPeriod &&
      isValidTokenReleasePerEachCycle
    ) {
      setCanProceedToNextStep(true)
    } else {
      setCanProceedToNextStep(false)
    }
  }

  useEffect(() => {
    validateFormsInputForProceed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    projectName,
    tokensPerBNB,
    minimumBuy,
    maximumBuy,
    softCap,
    hardCap,
    startTime,
    endTime,
    liquidityPercentage,
    liquidityUnlockTime,
    isLiquidityBurn,
    launchRate,
    liquidityProvider,
    isWhitelistingEnabled,
    publicStartTime,
    isVestingEnabled,
    initialTokenReleasePercentage,
    vestingCyclesInDays,
    tokenReleasePercentageInCycle,
    endDateValidationStatus,
    softCapHardCapValidationStatus,
    minMaxBuyValidationStatus,
    liquidityLockValidationStatus,
    liquidityUnlockValidationStatus,
    launchRateValidationStatus
  ])

  return (
    <div>
      <div className='mb-2'>
        <span className='text-validation-error'>(*) {t('is required field.')}</span>
      </div>
      <Form
        name="project_info"
        onFinish={onFinish}
        initialValues={{
          projectName: projectName,
          tokensPerBNB: tokensPerBNB,
          minimumBuy: minimumBuy,
          maximumBuy: maximumBuy,
          hardCap: hardCap,
          softCap: softCap,
          startTime: startTime ? moment(startTime, "yyyy-MM-DD HH:mm:ss") : null,
          endTime: endTime ? moment(endTime, "yyyy-MM-DD HH:mm:ss") : null,
          publicStartTime: publicStartTime ? moment(publicStartTime, "yyyy-MM-DD HH:mm:ss") : null,
          liquidityPercentage: liquidityPercentage,
          liquidityUnlockTime: liquidityUnlockTime ? liquidityUnlockTime : 0,
          launchRate: launchRate,
          initialTokenReleasePercentage: initialTokenReleasePercentage,
          vestingCyclesInDays: vestingCyclesInDays,
          tokenReleasePercentageInCycle: tokenReleasePercentageInCycle,
          liquidityProvider: liquidityProvider
        }}
      >
        <Row>
          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Project Name')} <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="projectName"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              rules={[
                {
                  required: true,
                  message: t('Please enter the project name!'),
                },
              ]}
            >
              <Input
                lang='en'
                size='large'
                placeholder={t('Enter the project name')} />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Tokens per')} {liquidityTokenName} ~ 1 {liquidityTokenName} = {tokensPerBNB} {tokenSymbol} <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="tokensPerBNB"
              value={tokensPerBNB}
              onChange={e => setTokensPerBNB(e.target.value)}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t(`Please enter tokens per ${liquidityTokenName} amount`),
                },
                () => ({
                  validator(_, value) {
                    if (!value || value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Value cannot be negative!'));
                  },
                }),
              ]}
            >
              <Input lang='en' size='large' type='number' min={0} />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Minimum Buy')} ({liquidityTokenName}) <span className='required-field-warning'>*</span></span>
            <Form.Item
              hasFeedback
              help={minMaxBuyValidationMessage}
              validateStatus={minMaxBuyValidationStatus}
              value={minimumBuy}
              onChange={e => setMinimumBuy(e.target.value)}
              name="minimumBuy"
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || (value >= 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Enter a valid value!'));
                  },
                }),
              ]}
            >
              <Input lang='en' type="number" size="large" />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Maximum Buy')} ({liquidityTokenName}) <span className='required-field-warning'>*</span></span>
            <Form.Item
              hasFeedback
              help={minMaxBuyValidationMessage}
              validateStatus={minMaxBuyValidationStatus}
              name="maximumBuy"
              onChange={e => setMaximumBuy(e.target.value)}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || (value >= 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Enter a valid value!'));
                  },
                }),
              ]}
              value={maximumBuy}
            >
              <Input lang='en' type="number" size="large" />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Soft Cap')} ({liquidityTokenName}) <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="softCap"
              hasFeedback
              validateStatus={softCapHardCapValidationStatus}
              help={softCapHardCapValidationMessage}
              value={softCap}
              onChange={e => setSoftCap(e.target.value)}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Value cannot be negative!'));
                  },
                }),
              ]}
            >
              <Input lang='en' type="number" size="large" />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Hard Cap')} ({liquidityTokenName}) <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="hardCap"
              value={hardCap}
              hasFeedback
              validateStatus={softCapHardCapValidationStatus}
              help={softCapHardCapValidationMessage}
              onChange={e => setHardCap(e.target.value)}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Value cannot be negative!'));
                  },
                }),
              ]}
            >
              <Input lang='en' type="number" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Start time')} (UTC {moment().utc().format('yyyy-MM-DD HH:mm:ss').toString()} {t('Now')}) <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="startTime"
              hasFeedback
              validateStatus={startDateValidationStatus}
              help={startDateValidationMessage}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                }
              ]}
            >
              <DatePicker
                size='large'
                className="input-background-inside-form col-12"
                format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                disabledDate={d => !d || d.isBefore(moment().utc().format('yyyy-MM-DD').toString())}
                showTime
                onChange={onChangeStartDate}
              />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className="small">{t('End time')} (UTC) <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="endTime"
              hasFeedback
              validateStatus={endDateValidationStatus}
              help={endDateValidationMessage}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
              ]}
            >
              <DatePicker
                size='large'
                className="input-background-inside-form col-12"
                format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                showTime
                onChange={onChangeEndDate}
                disabledDate={d => !d || d.isBefore(startTime)}
                disabled={!startTime}
              />
            </Form.Item>
          </Col>
        </Row>


        <Row className='mt-4'>
          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Liquidity percentage')} <span className='required-field-warning'>*</span></span>
            <Form.Item
              name="liquidityPercentage"
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Value cannot be negative!'));
                  },
                }),
              ]}
              hasFeedback
              validateStatus={liquidityLockValidationStatus}
              help={liquidityLockValidationMessage}
              value={liquidityPercentage}
              onChange={e => setLiquidityPercentage(e.target.value)}
            >
              <Input lang='en' type="number" size="large" suffix="%" min={0} />
            </Form.Item>

          </Col>


          <Col lg="6" md="6" sm="12">
            <span className="small">
              {t('Liquidity Unlock At (Days)')}
              <span className='required-field-warning'>*</span></span> -
            <Checkbox
              style={{ marginLeft: '5px' }}
              checked={isLiquidityBurn}
              onChange={e => handleLiquidityBurn(e.target.checked)}

            >
              {t('Burn Liquidity')}
            </Checkbox>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
              ]}
              hasFeedback
              help={liquidityUnlockValidationMessage}
              validateStatus={liquidityUnlockValidationStatus}
            >
              <Input
                lang='en'
                name="liquidityUnlockTime"
                onChange={e => setLiquidityUnlockTime(e.target.value)}
                value={liquidityUnlockTime}
                type="number"
                size="large"
                disabled={isLiquidityBurn} min={0} />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Launch rate')} ~ 1 {liquidityTokenName} = {launchRate} {tokenSymbol}<span className='required-field-warning'>*</span>

            </span>
            <Form.Item
              name="launchRate"
              hasFeedback
              validateStatus={launchRateValidationStatus}
              help={launchRateValidationMessage}
              onChange={e => setLaunchRate(e.target.value)}
              rules={[
                {
                  required: true,
                  message: t('This is a required field!'),
                },
                () => ({
                  validator(_, value) {
                    if (!value || value >= 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Value cannot be negative!'));
                  },
                }),
              ]}
            >
              <Input lang='en' type="number" size="large" min={0} />
            </Form.Item>
          </Col>

          <Col lg="6" md="6" sm="12">
            <span className='small'>{t('Router')}</span>
            <Form.Item
              name="liquidityProvider"
            >
              <Select
                onChange={handleLiquidityProviderChange}
                size="large"
              >
                {
                  liquidityProviders.map(item => (

                    <Option
                      value={item.routerAddress}
                      key={item.providerName}>
                      {item.providerName}
                    </Option>
                  ))
                }

              </Select>
            </Form.Item>
          </Col>
        </Row>



        <Col lg="12" md="12" sm="12">
          <Form.Item
            name="whitelisting"
          >
            <Checkbox
              checked={isWhitelistingEnabled}
              onChange={e => setIsWhitelistingEnabled(e.target.checked)}
            // disabled={!isNextButtonActive}
            >
              {t('Enable Whitelisting Feature')}
            </Checkbox>
          </Form.Item>
        </Col>

        <Col lg="6" md="6" sm="12">
          <span className="small">{t('Public Sale Start Time (UTC)')}
            {
              isWhitelistingEnabled ? (
                <span className='required-field-warning'> *</span>
              ) : (
                <></>
              )
            }
          </span>
          <Form.Item
            name="publicStartTime"
            hasFeedback
            validateStatus={publicStartValidationStatus}
            help={publicStartValidationMessage}
            rules={[
              {
                required: isWhitelistingEnabled ? true : false,
                message: t('This is a required field!'),
              },
            ]}
          >
            <DatePicker
              size='large'
              className="input-background-inside-form col-12"
              format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
              disabledDate={d => !d || d.isBefore(moment().utc().format('yyyy-MM-DD').toString())}
              onChange={onChangePublicStartTime}
              disabled={!isWhitelistingEnabled}
              showTime
            />
          </Form.Item>
          <div className='remove-margin-top'>
            {
              !isPublicStartTimeValid ? (
                <span className="text-validation-error">{t('Public sale should start after the pool started')}</span>
              ) : (
                <></>
              )
            }
          </div>
        </Col>

        <Col lg="12" md="12" sm="12" className='mt-5'>
          <Form.Item
            name="isVestingEnabled"
          >
            <Checkbox
              checked={isVestingEnabled}
              onChange={e => setIsVestingEnabled(e.target.checked)}
            // disabled={!isNextButtonActive}
            >
              {t('Investor Vesting Period')}
            </Checkbox>
          </Form.Item>
        </Col>

        {
          isVestingEnabled ? (
            <Row>
              <Col lg="6" md="6" sm="12">
                <span className='small'>{t('Initial token release (percentage)')} <span className='required-field-warning'>*</span></span>
                <Form.Item
                  name="initialTokenReleasePercentage"
                  value={initialTokenReleasePercentage}
                  help={initialTokenReleasePercentageMessage}
                  validateStatus={initialTokenReleasePercentageStatus}
                  hasFeedback
                  onChange={e => setInitialTokenReleasePercentage(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: t('This is a required field!'),
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Value cannot be negative!'));
                      },
                    }),
                  ]}
                >
                  <Input lang='en' type="number" size="large" max={100} min={0} />
                </Form.Item>
              </Col>

              <Col lg="6" md="6" sm="12">
                <span className='small'>
                  {t('Vesting period each cycle (days)')} <span className='required-field-warning'>*</span></span>
                <Form.Item
                  name="vestingCyclesInDays"
                  value={vestingCyclesInDays}
                  onChange={e => setVestingCyclesInDays(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: t('This is a required field!'),
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Value cannot be negative!'));
                      },
                    }),
                  ]}
                >
                  <Input lang='en' type="number" size="large" min={0} />
                </Form.Item>
              </Col>

              <Col lg="6" md="6" sm="12">
                <span className='small'>
                  {t('Token release percentage in each cycle')} <span className='required-field-warning'>*</span></span>
                <Form.Item
                  name="tokenReleasePercentageInCycle"
                  value={tokenReleasePercentageInCycle}
                  onChange={e => setTokenReleasePercentageInCycle(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: t('This is a required field!'),
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Value cannot be negative!'));
                      },
                    }),
                  ]}
                >
                  <Input lang='en' type="number" size="large" min={0} />
                </Form.Item>
              </Col>
            </Row>
          ) : (<></>)
        }

        <div className='token-needed-helper mb-4'>
          <span className='text-muted small'>
            {t('You will need')} {<NumberFormat
              value={minimumTokenNeedsForPoolCreation}
              thousandSeparator={true}
              displayType={'text'}
              suffix={" " + tokenSymbol}
              decimalScale={3} />} {t('tokens to create this pool')}
          </span>
        </div>
        {
          isUserHaveEnoughTokensToProceed ? (<></>) : (
            <div className="user-token-balance-validation">
              <Alert
                message="Warning"
                description={userTokenBalanceValidationMessage}
                type="warning"
                showIcon
              />
            </div>
          )
        }

        <Row>
          <Col lg="12" md="12" sm="12" className='text-end mt-3'>
            <Form.Item>
              <Button onClick={() => setStepNumberParent(0)} style={{ marginRight: '5px' }}>{t('Back')}</Button>
              <Button
                type="primary"
                htmlType='submit'
                disabled={!canProceedToNextStep && !everyFieldFilled}>{t('Next')}</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default ProjectInformation