import React, { useEffect, useState } from 'react'
import {
  Modal,
  Card,
  Input,
  Button,
  Radio,
  notification,
  Form,
  Slider
} from 'antd'
import { Row, Col } from 'reactstrap';
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next';
import {
  getTokenPriceInUSDByTokenAddress,
  getERC20TokenBalanceByWalletAddress
} from '../../../Blockchain/services/common.service';
import NumberFormat from 'react-number-format';
import { Spin } from 'antd/lib';
import {
  approveTokenForStaking,
  stakeTokens,
  getMaximumTokenStakingLimit
} from '../../../Blockchain/services/staking.service';

function StakingModel(props) {

  const {
    isStakingAmountModelVisible,
    setIsStakingAmountModelVisible,
    stakedTokenDetails,
    userStakingAmount,
    setUserStakingAmount,
    stakingPoolAddress,
    userStakedDetails,
    setIsForceRefreshData
  } = props
  const { t } = useTranslation();

  const { account, library } = useWeb3React()

  const [stakeAmountValidationStatus, setStakeAmountValidationStatus] = useState(null)
  const [stakeAmountValidationMessage, setStakeAmountValidationMessage] = useState(null)
  const [stakeTokenPriceInUSD, setStakeTokenPriceInUSD] = useState(0.0)
  const [isStakeTokenPriceLoading, setIsStakeTokenPriceLoading] = useState(false)
  const [totalTokenUSDValue, setTotalTokenUSDValue] = useState(0.0)

  const [userStakedTokenBalance, setUserStakedTokenBalance] = useState(0.0)
  const [isUserStakedTokenBalanceLoading, setIsUserStakedTokenBalanceLoading] = useState(false)
  const [sliderValue, setSliderValue] = useState(0.0)
  const [selectedPercentage, setSelectedPercentage] = useState(0)

  const [isTokenApprovalLoading, setIsTokenApprovalLoading] = useState(false)
  const [isStakeButtonVisible, setIsStakeButtonVisible] = useState(false)

  const [isStakingLoading, setIsStakingLoading] = useState(false)

  const [maximumStakeLimitPerUser, setMaximumStakeLimitPerUser] = useState(0)
  const [isMaximumStakeLimitLoading, setIsMaximumStakeLimitLoading] = useState(false)

  const [remainingStakingAmount, setRemainingStakingAmount] = useState(0.0)

  const key = 'updatable';

  const handleModelClose = () => {
    setIsStakingAmountModelVisible(false)
  }


  const fetchStakeTokenPriceInUSD = async () => {
    setIsStakeTokenPriceLoading(true)
    try {
      const tokenPriceResponse = await getTokenPriceInUSDByTokenAddress(stakedTokenDetails?.tokenAddress)
      setStakeTokenPriceInUSD(tokenPriceResponse)
      setIsStakeTokenPriceLoading(false)
    } catch (error) {
      setIsStakeTokenPriceLoading(false)
      setStakeTokenPriceInUSD(0.0)
      console.log("ERROR while fetching stake token price in USD", error)
    }
  }

  const fetchUserStakedTokenBalance = async () => {
    setIsUserStakedTokenBalanceLoading(true)
    try {
      const tokenBalanceResponse = await getERC20TokenBalanceByWalletAddress(stakedTokenDetails?.tokenAddress, account)
      setUserStakedTokenBalance(tokenBalanceResponse)
      setIsUserStakedTokenBalanceLoading(false)
    } catch (error) {
      setIsUserStakedTokenBalanceLoading(false)
      setUserStakedTokenBalance(0.0)
      console.log("ERROR while fetching user staked token balance", error)
    }
  }

  const fetchMaximumStakeLimitPerUser = async () => {
    setIsMaximumStakeLimitLoading(true)
    try {
      const maximumStakeLimitResponse = await getMaximumTokenStakingLimit(stakingPoolAddress, stakedTokenDetails?.tokenAddress)
      setMaximumStakeLimitPerUser(maximumStakeLimitResponse)
      setIsMaximumStakeLimitLoading(false)
    } catch (error) {
      setIsMaximumStakeLimitLoading(false)
      setMaximumStakeLimitPerUser(0)
      console.log("ERROR while fetching maximum stake limit per user", error)
    }
  }

  useEffect(() => {
    if (userStakedDetails && userStakedDetails?.stakedAmount) {
      const remainingStakingAmountResponse = parseFloat(maximumStakeLimitPerUser) - parseFloat(userStakedDetails?.stakedAmount)
      setRemainingStakingAmount(remainingStakingAmountResponse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStakedDetails, maximumStakeLimitPerUser])


  const handleApproveToken = async () => {
    setIsTokenApprovalLoading(true)
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

      if (!stakedTokenDetails && !stakingPoolAddress) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not find required data to proceed'),
        });
        setIsTokenApprovalLoading(false)
        return
      }
      const result = await approveTokenForStaking(
        stakedTokenDetails?.tokenAddress,
        stakingPoolAddress,
        userStakingAmount,
        library.getSigner())
      console.log("TOKEN APPROVAL RESULT ", result)
      setIsTokenApprovalLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('Token has been approved please proceed with staking')
      })
      setIsStakeButtonVisible(true)
    } catch (error) {
      setIsTokenApprovalLoading(false)
      console.log("ERROR while trying to approve token for staking", error)
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error
      })
    }
  }

  const handleStaking = async () => {
    setIsStakingLoading(true)
    try {

      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsStakingLoading(false)
        return
      }

      if (!stakingPoolAddress) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not find required data to proceed'),
        });
        setIsStakingLoading(false)
        return
      }
      const result = await stakeTokens(
        stakedTokenDetails?.tokenAddress,
        stakingPoolAddress,
        userStakingAmount,
        library.getSigner())
      console.log("TOKEN STAKING RESULT ", result)
      setIsStakingLoading(false)
      setIsStakeButtonVisible(false)
      setUserStakingAmount('')
      setIsStakingAmountModelVisible(false)
      setIsForceRefreshData(true)
      notification['success']({
        key,
        message: t('Success'),
        description: t('Token has been staked')
      })
    } catch (error) {
      setIsStakingLoading(false)
      console.log("ERROR while trying to stake tokens", error)
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error
      })
    }
  }

  useEffect(() => {
    if (stakedTokenDetails && stakedTokenDetails?.tokenAddress) {
      fetchStakeTokenPriceInUSD()
      fetchMaximumStakeLimitPerUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakedTokenDetails])

  useEffect(() => {
    if (stakedTokenDetails && stakedTokenDetails?.tokenAddress && account) {
      fetchUserStakedTokenBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakedTokenDetails, account])

  useEffect(() => {
    if (userStakingAmount && stakeTokenPriceInUSD) {
      const totalUSDAmount = parseFloat(userStakingAmount) * parseFloat(stakeTokenPriceInUSD)
      setTotalTokenUSDValue(totalUSDAmount)
    }
  }, [stakeTokenPriceInUSD, userStakingAmount])

  const formatter = (value) => `${value}%`

  const handleSliderValue = (value) => {
    const selectedAmount = (parseFloat(userStakedTokenBalance) * parseInt(value)) / 100
    setUserStakingAmount(selectedAmount)
  }

  useEffect(() => {
    const sliderVal = (parseFloat(userStakingAmount) / parseFloat(userStakedTokenBalance)) * 100
    setSliderValue(sliderVal)
  }, [userStakingAmount, userStakedTokenBalance])

  useEffect(() => {
    const selectedAmount = (parseFloat(userStakedTokenBalance) * parseInt(selectedPercentage)) / 100
    setUserStakingAmount(selectedAmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPercentage, userStakedTokenBalance])

  useEffect(() => {

    //check if user has enough tokens to stake
    if (!parseFloat(userStakedTokenBalance) > 0) {
      const message = t('You do not have enough tokens to stake')
      setStakeAmountValidationMessage(message)
      setStakeAmountValidationStatus('error')
      return
    }

    //check if user has already staked the maximum amount
    if (parseFloat(remainingStakingAmount) === 0) {
      const message = t('You have already staked the maximum amount')
      setStakeAmountValidationMessage(message)
      setStakeAmountValidationStatus('error')
      return
    }

    //check if user input value is bigger than remaining staking amount
    if (parseFloat(userStakingAmount) > parseFloat(remainingStakingAmount)) {
      const message = t('You can not stake more than the remaining amount')
      setStakeAmountValidationMessage(message)
      setStakeAmountValidationStatus('error')
      return
    }

    setStakeAmountValidationStatus('')
    setStakeAmountValidationMessage('')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStakingAmount, maximumStakeLimitPerUser, userStakedTokenBalance, remainingStakingAmount])

  return (
    <Modal
      title={t("Stake in Pool")}
      visible={isStakingAmountModelVisible}
      onOk={handleModelClose}
      onCancel={handleModelClose}
      footer={false}>
      <div>
        <div className='staking-token-details d-flex justify-content-between' style={{ padding: '10px' }}>
          <div className='stake-token-data primary-text'>
            {t('Staked')}
          </div>
          <div className='stake-token-value'>
            {stakedTokenDetails?.tokenName}
          </div>
        </div>
        <Card className='kingsale-card-bg'>
          <Row>
            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
              {
                isMaximumStakeLimitLoading ? (
                  <div className='loader d-flex justify-content-center'>
                    <Spin size="small" />
                  </div>
                ) : (
                  <div className='staking-user-info'>
                    <div
                      style={{ padding: '2px 5px', fontSize: '10px' }}
                      className='maximum-token-stake-limit d-flex justify-content-between'>
                      <div className='stake-limit-label'>
                        {t('Maximum stake limit per user : ')}
                      </div>

                      <div className='stake-limit-value'>
                        <NumberFormat
                          displayType='text'
                          value={maximumStakeLimitPerUser}
                          decimalScale={2}
                          thousandSeparator={true}
                          suffix={` ${stakedTokenDetails?.tokenSymbol}`}
                        />
                      </div>
                    </div>
                    <div
                      style={{ padding: '2px 5px', fontSize: '10px' }}
                      className='maximum-token-stake-limit d-flex justify-content-between'>
                      <div className='stake-limit-label'>
                        {t('Remaining Staking Amount for user : ')}
                      </div>

                      <div className='stake-limit-value'>
                        <NumberFormat
                          displayType='text'
                          value={remainingStakingAmount}
                          decimalScale={2}
                          thousandSeparator={true}
                          suffix={` ${stakedTokenDetails?.tokenSymbol}`}
                        />
                      </div>
                    </div>
                  </div>


                )
              }


              <Form.Item
                validateStatus={stakeAmountValidationStatus}
                help={stakeAmountValidationMessage}
                style={{ marginBottom: '0px' }}
              >
                <Input
                  lang='en'
                  type="number"
                  name="stakedTokenAmount"
                  suffix={stakedTokenDetails?.tokenSymbol}
                  value={userStakingAmount}
                  disabled={isStakeTokenPriceLoading}
                  onChange={(e) => setUserStakingAmount(e.target.value)}
                  placeholder="0.00" />

                <span className='text-small' style={{ fontSize: '10px', padding: '0 5px' }}>
                  <NumberFormat
                    displayType='text'
                    value={totalTokenUSDValue}
                    decimalScale={4}
                    thousandSeparator={true}
                    suffix=" USD"
                  />
                </span>
              </Form.Item>

              <div className='token-balance'>
                {
                  isUserStakedTokenBalanceLoading ? (
                    <div className='loader d-flex justify-content-start'>
                      <Spin size="small" />
                    </div>
                  ) : (
                    <span className='text-small' style={{ fontSize: '12px', paddingLeft: '5px' }}>
                      <NumberFormat
                        displayType='text'
                        value={userStakedTokenBalance}
                        decimalScale={4}
                        prefix="Balance: "
                        thousandSeparator={true}
                      />
                    </span>
                  )
                }

              </div>
            </Col>
            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
              <div className='slider-selector' style={{ marginTop: '20px' }}>
                <Slider
                  onChange={handleSliderValue}
                  value={sliderValue}
                  min={0}
                  max={100}
                  tooltip={{
                    formatter
                  }} />
              </div>

              <div className='mt-2'>
                <Radio.Group size="small" className='col-12' value={selectedPercentage} onChange={(e) => setSelectedPercentage(e.target.value)}>
                  <div className='d-flex'>
                    <Col className='text-center' style={{ margin: '2px' }}>
                      <Radio.Button value="25" className='col-12'>25%</Radio.Button>
                    </Col>

                    <Col className='text-center' style={{ margin: '2px' }}>
                      <Radio.Button value="50" className='col-12'>50%</Radio.Button>
                    </Col>

                    <Col className='text-center' style={{ margin: '2px' }}>
                      <Radio.Button value="75" className='col-12'>75%</Radio.Button>
                    </Col>

                    <Col className='text-center' style={{ margin: '2px' }}>
                      <Radio.Button value="100" className='col-12'>MAX</Radio.Button>
                    </Col>
                  </div>
                </Radio.Group>
              </div>
            </Col>

            <Col className='my-auto mt-4'>
              {
                isStakeButtonVisible ? (<div className='stake-token-button mt-2'>
                  <Button
                    loading={isStakingLoading}
                    onClick={handleStaking}
                    size="large"
                    block
                    className='kingsale-primary-button'>
                    {t('Stake')}
                  </Button>
                </div>) : (
                  <div className='approve-button'>
                    <Button
                      disabled={stakeAmountValidationMessage !== ''}
                      loading={isTokenApprovalLoading}
                      onClick={handleApproveToken}
                      size="large"
                      block
                      className='kingsale-primary-button'>
                      {t('Approve Tokens')}
                    </Button>
                  </div>
                )
              }

            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  )
}

export default StakingModel