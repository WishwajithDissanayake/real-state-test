import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Spin,
  notification
} from 'antd'
import {
  getERC20TokenDataByTokenAddress,
  getERC20TokenBalanceByWalletAddress,
} from '../../../Blockchain/services/common.service'
import {
  lockTheTokensWithoutVesting,
  lockTheTokensWithVesting,
  approveTokenForLock,
  updateLockRecordTxDetails,
  saveLockTokenDataInDatabase
} from '../../../Blockchain/services/tokenLock.service'
import { useWeb3React } from '@web3-react/core'
import { DateTime } from 'luxon'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

export default function TokenLockerForm() {

  const [isVestingEnabled, setIsVestingEnabled] = useState(false)
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [userTokenBalance, setUserTokenBalance] = useState(0.00)
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [title, setTitle] = useState('')
  const [lockingTokenAmount, setLockingTokenAmount] = useState('')
  const [initialVestingReleaseTime, setInitialVestingReleaseTime] = useState('')
  const [initialVestingReleasePercentage, setInitialVestingReleasePercentage] = useState('')
  const [vestingReleaseCycles, setVestingReleaseCycles] = useState('')
  const [vestingReleasePercentage, setVestingReleasePercentage] = useState('')
  const [tokenLockTime, setTokenLockTime] = useState('')

  const [tokenValidationStatus, setTokenValidationStatus] = useState(null)
  const [tokenValidationHelperMessage, setTokenValidationHelperMessage] = useState(null)
  const [isTokenDetailsLoading, setIsTokenDetailsLoading] = useState(false)

  const [yourBalanceValidationStatus, setYourBalanceValidationStatus] = useState(null)
  const [yourBalanceValidationHelperMessage, setYourBalanceValidationHelperMessage] = useState(null)

  const [isLockButtonDisabled, setIsLockButtonDisabled] = useState(true)
  const [isTokenApprovalLoading, setIsTokenApprovalLoading] = useState(false)

  const [isTokenLockLoading, setIsTokenLockLoading] = useState(false)

  const [tokenLockerForm] = Form.useForm()
  const { t } = useTranslation();

  const navigate = useNavigate()

  const tokenLockWarningMessage = "Please exclude KingSale\'s lockup address OXXXXXXXXXXXXXXXXXXXXXXXXXXX from Fees, Rewards and Max tx amount to start locking tokens. KingSale does not support rebase tokens."

  const { account, library } = useWeb3React()

  const key = 'updatable';

  const handleLockUntilDate = (value, dateString) => {
    setTokenLockTime(dateString)
  }

  const handleInitialVestingReleaseDate = (value, dateString) => {
    setInitialVestingReleaseTime(dateString)
  }

  const handleTokenAmountChange = (e) => {
    const value = e.target.value
    if (value) {
      if (parseFloat(value) > parseFloat(userTokenBalance)) {
        notification['error']({
          key,
          message: t('Input Validation Error'),
          description:
            t('Lock amount can not exceeds the user token balance'),
        });
        setLockingTokenAmount(userTokenBalance)
      } else {
        setLockingTokenAmount(value)
      }
    } else {
      setLockingTokenAmount(null)
    }

  }

  const fetchUserTokenBalance = async () => {
    try {

      if (account) {
        setYourBalanceValidationStatus('validating')
        setYourBalanceValidationHelperMessage(t('Fetching token balance please wait'))
        const tokenBalanceResponse = await getERC20TokenBalanceByWalletAddress(tokenAddress, account)
        setUserTokenBalance(tokenBalanceResponse)
        setYourBalanceValidationStatus(null)
        setYourBalanceValidationHelperMessage(null)
      } else {
        setYourBalanceValidationHelperMessage(t('Please connect your wallet to fetch the token balance'))
        setUserTokenBalance(0)
        setYourBalanceValidationStatus('error')
      }

    } catch (error) {
      setYourBalanceValidationHelperMessage(null)
      setYourBalanceValidationStatus(null)
    }
  }

  const fetchTokenDetails = async () => {
    try {
      setIsTokenDetailsLoading(true)
      setTokenValidationStatus('validating')
      setTokenValidationHelperMessage(t('validating token data'))
      const tokenDataResponse = await getERC20TokenDataByTokenAddress(tokenAddress)

      setTokenValidationHelperMessage(null)
      setTokenValidationStatus('success')
      setIsTokenDetailsLoading(false)

      //set token details
      setTokenName(tokenDataResponse?.tokenName)
      setTokenSymbol(tokenDataResponse?.tokenSymbol)
      setTokenDecimals(tokenDataResponse?.tokenDecimals)



    } catch (error) {
      setTokenValidationStatus('error')
      setTokenValidationHelperMessage('Please enter the valid token address')

      //set token details
      setTokenName('')
      setTokenSymbol('')
      setTokenDecimals('')
      setUserTokenBalance('')
      setIsTokenDetailsLoading(false)
    }
  }

  const handleMaxAmount = () => {
    if (userTokenBalance && userTokenBalance > 0) {
      setLockingTokenAmount(userTokenBalance)
    } else {
      setLockingTokenAmount(0)
    }
  }

  useEffect(() => {
    if (lockingTokenAmount) {
      setIsLockButtonDisabled(true)
    }
  }, [lockingTokenAmount])

  useEffect(() => {

    if (tokenAddress) {
      fetchUserTokenBalance()
    } else {
      setUserTokenBalance('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, account])

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails()
    } else {
      setTokenValidationStatus(null)
      setTokenValidationHelperMessage(null)
      setTokenName('')
      setTokenSymbol('')
      setTokenDecimals('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress])

  const handleApproval = async () => {
    try {
      setIsTokenApprovalLoading(true)

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

      if (!tokenAddress) {
        notification['error']({
          key,
          message: t('Validation Error'),
          description:
            t('Please enter the token address'),
        });
        setIsTokenApprovalLoading(false)
        return
      }

      if (!lockingTokenAmount) {
        notification['error']({
          key,
          message: t('Validation Error'),
          description:
            t('Please enter valid amount for token lock'),
        });
        setIsTokenApprovalLoading(false)
        return
      }

      const result = await approveTokenForLock(tokenAddress, lockingTokenAmount, library.getSigner())
      console.log("APPROVE RESULT ", result)
      setIsLockButtonDisabled(false)
      notification['success']({
        key,
        message: 'Success',
        description: t('Token Approval Success, Please proceed to lock token.'),
      });
      setIsTokenApprovalLoading(false)
    } catch (error) {
      setIsTokenApprovalLoading(false)
      setIsLockButtonDisabled(true)
      console.error("ERROR while trying to approve tokens for locking")
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error,
      });

    }
  }

  const onFinish = async () => {

    setIsTokenLockLoading(true)
    try {
      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsTokenLockLoading(false)
        return
      }



      console.log("LP_LOCK tokenAddress", tokenAddress)
      console.log("LP_LOCK tokenName", tokenName)
      console.log("LP_LOCK tokenSymbol", tokenSymbol)
      console.log("LP_LOCK userTokenBalance", userTokenBalance)
      console.log("LP_LOCK tokenDecimals", tokenDecimals)
      console.log("LP_LOCK title", title)
      console.log("LP_LOCK lockingTokenAmount", lockingTokenAmount)
      console.log("LP_LOCK isVestingEnabled", isVestingEnabled)
      console.log("LP_LOCK tokenLockTime", tokenLockTime)
      console.log("LP_LOCK initialVestingReleaseTime", initialVestingReleaseTime)
      console.log("LP_LOCK initialVestingReleasePercentage", initialVestingReleasePercentage)
      console.log("LP_LOCK vestingReleaseCycles", vestingReleaseCycles)
      console.log("LP_LOCK vestingReleasePercentage", vestingReleasePercentage)

      if (!isVestingEnabled) {

        const tokenLockTimeUTCSeconds = DateTime.fromFormat(tokenLockTime, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
        console.log("LP_LOCK tokenLockTimeUTCSeconds", tokenLockTimeUTCSeconds)

        //save data in database
        const response = await lockTheTokensWithoutVesting(tokenAddress, lockingTokenAmount, tokenLockTimeUTCSeconds, library.getSigner())
        console.log("LOCK RESULT", response)
        if (response) {
          const payload = {
            title: title,
            tokenAddress: tokenAddress,
            tokenOwner: account,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenDecimals: tokenDecimals,
            tokenUnlockTime: tokenLockTime,
            unlockTimestamp: tokenLockTimeUTCSeconds,
            transactionHash: null,
            tokenLockId: null,
            tokenLockAmount: lockingTokenAmount,
            isVestingEnabled: isVestingEnabled,
            initialVestingReleaseDate: null,
            initialVestingReleasePercentage: null,
            vestingCycleInMinutes: null,
            vestingReleasePercentage: null,
            beneficiaryWalletAddress: null,
          }

          const saveDataResponse = await saveLockTokenDataInDatabase(payload)
          const updatePayload = {
            transactionHash: response.transactionHash,
            tokenLockId: response.tokenLockId
          }
          await updateLockRecordTxDetails(updatePayload, saveDataResponse.id)
          console.log("API RESPONSE", saveDataResponse)
        }
        //update the tx hash and token id from the event log
        setIsTokenLockLoading(false)


        notification['success']({
          key,
          message: t('Success'),
          description: t('Token has been locked.'),
        });

        const redirectLink = `/token-lock/record/${response.transactionHash}`
        navigate(redirectLink)

      } else {

        const initialVestingReleaseTimeUTCSeconds = DateTime.fromFormat(initialVestingReleaseTime, "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds()
        console.log("LP_LOCK initialVestingReleaseTimeUTCSeconds", initialVestingReleaseTimeUTCSeconds)

        const response = await lockTheTokensWithVesting(
          tokenAddress,
          lockingTokenAmount,
          initialVestingReleaseTimeUTCSeconds,
          initialVestingReleasePercentage,
          vestingReleaseCycles,
          vestingReleasePercentage,
          library.getSigner()
        )
        console.log("LOCK RESULT WITH VESTING", response)
        if (response) {
          //save data in database
          const payload = {
            title: title,
            tokenAddress: tokenAddress,
            tokenOwner: account,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenDecimals: tokenDecimals,
            tokenUnlockTime: initialVestingReleaseTime,
            unlockTimestamp: initialVestingReleaseTimeUTCSeconds,
            transactionHash: null,
            tokenLockId: null,
            tokenLockAmount: lockingTokenAmount,
            isVestingEnabled: isVestingEnabled,
            initialVestingReleaseDate: initialVestingReleaseTime,
            initialVestingReleasePercentage: initialVestingReleasePercentage,
            vestingCycleInMinutes: vestingReleaseCycles,
            vestingReleasePercentage: vestingReleasePercentage,
            beneficiaryWalletAddress: null,
          }

          const saveVestingDataResponse = await saveLockTokenDataInDatabase(payload)
          console.log("API RESPONSE", saveVestingDataResponse)
          const updatePayload = {
            transactionHash: response.transactionHash,
            tokenLockId: response.tokenLockId
          }

          await updateLockRecordTxDetails(updatePayload, saveVestingDataResponse.id)
        }
        notification['success']({
          key,
          message: t('Success'),
          description: t('Token has been locked.'),
        });

        const redirectLink = `/token-lock/record/${response.transactionHash}`
        navigate(redirectLink)
        setIsTokenLockLoading(false)

      }

      // rest the form after successfully submit
      resetFormFields()
    } catch (error) {

      setIsTokenLockLoading(false)
      console.error("ERROR while trying to lock the tokens", error)
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error,
      });
    }

  };


  const resetFormFields = () => {
    setTokenAddress('')
    setTokenName('')
    setTokenSymbol('')
    setUserTokenBalance('')
    setTokenDecimals('')
    setTitle('')
    setLockingTokenAmount('')
    setIsVestingEnabled(false)
    setInitialVestingReleasePercentage('')
    setVestingReleaseCycles('')
    setVestingReleasePercentage('')

    //reset the forms dates will not work in antd
    setInitialVestingReleaseTime(null)
    setTokenLockTime(null)
  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 18,
        color: '#e6bd4f',
      }}
      spin
    />
  );

  return (
    <div>
      <Form
        layout='vertical'
        name="basic"
        form={tokenLockerForm}
        onFinish={onFinish}
        initialValues={{
          tokenAddress: tokenAddress,
          tokenName: tokenName,
          tokenSymbol: tokenSymbol,
          userTokenBalance: userTokenBalance,
          tokenDecimals: tokenDecimals,
          title: title,
          lockingTokenAmount: lockingTokenAmount,
          isVestingEnabled: isVestingEnabled,
          initialVestingReleaseTime: initialVestingReleaseTime ? moment(initialVestingReleaseTime, "yyyy-MM-DD HH:mm:ss") : null,
          initialVestingReleasePercentage: initialVestingReleasePercentage,
          vestingReleaseCycles: vestingReleaseCycles,
          vestingReleasePercentage: vestingReleasePercentage,
          tokenLockTime: tokenLockTime ? moment(tokenLockTime, "yyyy-MM-DD HH:mm:ss") : null,
        }}
        fields={[
          {
            name: "tokenAddress",
            value: tokenAddress
          },
          {
            name: "tokenName",
            value: tokenName
          },
          {
            name: "tokenSymbol",
            value: tokenSymbol
          },
          {
            name: "userTokenBalance",
            value: userTokenBalance
          },
          {
            name: "tokenDecimals",
            value: tokenDecimals
          },
          {
            name: "title",
            value: title
          },
          {
            name: "lockingTokenAmount",
            value: lockingTokenAmount
          },
          {
            name: "isVestingEnabled",
            value: isVestingEnabled
          },
          {
            name: "initialVestingReleasePercentage",
            value: initialVestingReleasePercentage
          },
          {
            name: "vestingReleaseCycles",
            value: vestingReleaseCycles
          },
          {
            name: "vestingReleasePercentage",
            value: vestingReleasePercentage
          },
        ]}
      >

        <div className="input-header mx-1">{t("Enter the token address of the token you'd like to lock")}</div>
        <Form.Item
          // label={t("Enter the token address of the token you'd like to lock")}
          name="tokenAddress"
          hasFeedback
          validateStatus={tokenValidationStatus}
          help={tokenValidationHelperMessage}
          extra="e.g. 0x307c...3b7Dd6"
          rules={[
            {
              required: true,
              message: t('Please enter the token address!'),
            },
          ]}
        >
          <Input
            lang='en'
            value={tokenAddress}
            name="tokenAddress"
            onChange={e => setTokenAddress(e.target.value)}
            size='large'
            className='rounded-input'
            placeholder={t('Enter the token address')} />
        </Form.Item>


        {
          isTokenDetailsLoading ? (
            <div className='loader-spinner d-flex justify-content-center'>
              <Spin />
            </div>
          ) : (
            <div className='token-details-container'>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">
                  <div className="input-header mx-1">{t("Token Name")}</div>
                  <Form.Item
                    // label={t("Token Name")}
                    className='mx-1'>
                    <Input
                      lang='en'
                      name="tokenName"
                      value={tokenName}
                      readOnly
                      className='rounded-input'
                      size='large' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">
                  <div className="input-header mx-1">{t("Token Symbol")}</div>
                  <Form.Item
                    // label={t("Token Symbol")}
                    className='mx-1'>
                    <Input
                      lang='en'
                      name="tokenSymbol"
                      value={tokenSymbol}
                      className='rounded-input'
                      readOnly
                      size='large' />
                  </Form.Item>
                </Col>
              </Row>


              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">
                  <div className="input-header mx-1">{t("Your Balance")}</div>
                  <Form.Item
                    // label={t("Your Balance")}
                    hasFeedback
                    validateStatus={yourBalanceValidationStatus}
                    help={yourBalanceValidationHelperMessage}
                    className='mx-1'
                  >
                    <Input
                      lang='en'
                      name="userTokenBalance"
                      value={userTokenBalance}
                      className='rounded-input'
                      readOnly size='large' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">
                  <div className="input-header mx-1">{t("Decimals")}</div>
                  <Form.Item
                    // label={t("Decimals")}
                    className='mx-1'>
                    <Input
                      lang='en'
                      name="tokenDecimals"
                      value={tokenDecimals}
                      className='rounded-input'
                      readOnly
                      size='large' />
                  </Form.Item>
                </Col>
              </Row>
            </div>

          )
        }

        <div className="input-header mx-1">{t("Title")}</div>
        <Form.Item
          name="title"
        // label={t("Title")}
        >
          <Input
            lang='en'
            onChange={e => setTitle(e.target.value)}
            value={title}
            name="title"
            className='rounded-input'
            size='large'
            placeholder={t('Ex: My Lock')} />
        </Form.Item>

        <div className="input-header mx-1">{t("Amount")}</div>
        <Form.Item
          // label={t("Amount")}
          name="lockingTokenAmount"
          rules={[
            {
              required: true,
              message: t('Please enter the valid token amount!'),
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

          <Input
            className='rounded-input'
            value={lockingTokenAmount}
            onChange={handleTokenAmountChange}
            type="number"
            size='large'
            min={0}
            placeholder={t('Enter Amount')}
            suffix={<span onClick={handleMaxAmount} style={{ color: '#e6bd4f', cursor: 'pointer' }}>MAX</span>} />

        </Form.Item>

        <Form.Item
          name="isVestingEnabled"
          valuePropName="checked"
        >
          <Checkbox
            checked={isVestingEnabled}
            onChange={e => setIsVestingEnabled(e.target.checked)}
          >{t('Vesting')}</Checkbox>
        </Form.Item>

        {
          isVestingEnabled &&
          <div className='vesting-details-container'>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">

                <div className="input-header mx-1">{t("Initial Vesting Release Date (UTC Time)")}</div>
                <Form.Item
                  // label={t("Initial Vesting Release Date (UTC Time)")}
                  className='mx-1'
                  name="initialVestingReleaseTime"
                  rules={[
                    {
                      required: true,
                      message: t('Initial vesting release date is required!'),
                    }
                  ]}
                >
                  <DatePicker
                    className="col-12 rounded-input"
                    format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                    onChange={handleInitialVestingReleaseDate}
                    disabledDate={d => !d || d.isBefore(moment().utc().format('yyyy-MM-DD').toString())}
                    showTime
                    placeholder={t('Select date')}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">

                <div className="input-header mx-1">{t("Initial Vesting Release Percentage")}</div>
                <Form.Item
                  // label={t("Initial Vesting Release Percentage")}
                  className='mx-1'
                  name="initialVestingReleasePercentage"
                  rules={[
                    {
                      required: true,
                      message: t('Initial vesting vesting release percentage is required!'),
                    }
                  ]}
                >
                  <Input
                    lang='en'
                    value={initialVestingReleasePercentage}
                    onChange={e => setInitialVestingReleasePercentage(e.target.value)}
                    className='rounded-input'
                    placeholder='Ex: 10'
                    size='large' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">
                <div className="input-header mx-1">{t("Release Cycle (days)")}</div>
                <Form.Item
                  // label={t("Release Cycle (days)")}
                  className='mx-1'
                  name="vestingReleaseCycles"
                  rules={[
                    {
                      required: true,
                      message: t('Release Cycle is required!'),
                    }
                  ]}
                >
                  <Input
                    lang='en'
                    value={vestingReleaseCycles}
                    onChange={e => setVestingReleaseCycles(e.target.value)}
                    className='rounded-input'
                    placeholder='Ex: 10'
                    size='large' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-1">

                <div className="input-header mx-1">{t("Cycle Release Percentage")}</div>
                <Form.Item
                  // label={t("Cycle Release Percentage")}
                  className='mx-1'
                  name="vestingReleasePercentage"
                  rules={[
                    {
                      required: true,
                      message: t('Cycle Release Percentage is required!'),
                    }
                  ]}
                >
                  <Input
                    lang='en'
                    value={vestingReleasePercentage}
                    onChange={e => setVestingReleasePercentage(e.target.value)}
                    className='rounded-input'
                    placeholder='Ex: 10'
                    size='large' />
                </Form.Item>
              </Col>
            </Row>
          </div>
        }



        {
          !isVestingEnabled &&
          <>
            <div className="input-header mx-1">{t("Lock until (UTC time)")}</div>
            <Form.Item
              // label={t("Lock until (UTC time)")}
              name="tokenLockTime"
              rules={[
                {
                  required: true,
                  message: t('Lock until (UTC time) is required!'),
                }
              ]}
            >
              <DatePicker
                className="col-12 rounded-input"
                format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                onChange={handleLockUntilDate}
                disabledDate={d => !d || d.isBefore(moment().utc().format('yyyy-MM-DD').toString())}
                showTime
                placeholder={t('Select date')}
                size="large"
              />
            </Form.Item>
          </>
        }


        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-1 mb-4">
            <Alert
              message={tokenLockWarningMessage}
              type="warning"
              closable={false}
            />
          </Col>
        </Row>

        <Form.Item className='text-center'>

          {
            isLockButtonDisabled && isTokenApprovalLoading &&
            <Button
              className='kingsale-primary-button mx-2'>
              <Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />{t('Approve')}
            </Button>
          }

          {
            isLockButtonDisabled && !isTokenApprovalLoading &&
            <Button
              onClick={handleApproval}
              className='kingsale-primary-button mx-2'>
              {t('Approve')}
            </Button>
          }

          {
            !isLockButtonDisabled && isTokenLockLoading &&
            <Button
              disabled={isLockButtonDisabled}
              className='kingsale-primary-button'>
              <Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />{t('Lock')}
            </Button>
          }

          {
            !isLockButtonDisabled && !isTokenLockLoading &&
            <Button
              disabled={isLockButtonDisabled}
              htmlType="submit"
              className='kingsale-primary-button'>
              {t('Lock')}
            </Button>
          }
        </Form.Item>
      </Form>
    </div>
  )
}
