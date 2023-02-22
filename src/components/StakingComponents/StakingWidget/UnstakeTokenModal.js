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
import NumberFormat from 'react-number-format';
import {
  harvestEarning,
} from '../../../Blockchain/services/staking.service';

function UnstakeTokenModal(props) {

  const {
    stakingPoolAddress,
    isUnStakingAmountModelVisible,
    setIsUnStakingAmountModelVisible,
    stakedTokenDetails,
    setUserStakingAmount,
    userStakedDetails,
    rewardsTokenAddress,
    setIsForceRefreshData
  } = props
  const { t } = useTranslation();

  const { account, library } = useWeb3React()

  const [unStakeAmountValidationStatus, setUnStakeAmountValidationStatus] = useState(null)
  const [unStakeAmountValidationMessage, setUnStakeAmountValidationMessage] = useState(null)


  const [sliderValue, setSliderValue] = useState(0.0)
  const [selectedPercentage, setSelectedPercentage] = useState(0)
  const [isUnStakingLoading, setIsUnStakingLoading] = useState(false)

  const [unstakeTokenAmount, setUnstakeTokenAmount] = useState(0.0)

  const key = 'updatable';

  const formatter = (value) => `${value}%`

  const handleSliderValue = (value) => {
    const selectedAmount = (parseFloat(userStakedDetails?.stakedAmount) * parseInt(value)) / 100
    setUserStakingAmount(selectedAmount)
    setSliderValue(value)
  }

  const handleModelClose = () => {
    setIsUnStakingAmountModelVisible(false)
  }


  const handleUnstakeToken = async () => {
    setIsUnStakingLoading(true)
    try {
      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsUnStakingLoading(false)
        return
      }

      if (parseFloat(unstakeTokenAmount) > parseFloat(userStakedDetails?.stakedAmount)) {
        notification['error']({
          key,
          message: t('Invalid data'),
          description:
            t('Can not exceed maximum staked limit'),
        });
        setIsUnStakingLoading(false)
        return
      }

      const result = await harvestEarning(
        stakingPoolAddress,
        rewardsTokenAddress,
        unstakeTokenAmount,
        library.getSigner())
      console.log("UNSTAKING RESULT ", result)
      setIsUnStakingLoading(false)
      notification['success']({
        key,
        message: t('Success'),
        description: t('Token has been unstaked')
      })
      setIsUnStakingAmountModelVisible(false)
      setUnstakeTokenAmount('')
      setSliderValue(0)
      setIsForceRefreshData(true)
    } catch (error) {
      setIsUnStakingLoading(false)
      console.log("ERROR while trying to unstake your tokens", error)
      notification['error']({
        key,
        message: t('Transaction Execution Failed'),
        description: error
      })
    }
  }


  useEffect(() => {
    if (selectedPercentage) {
      const unstakeAmount = (parseFloat(userStakedDetails?.stakedAmount) * parseInt(selectedPercentage)) / 100
      setSliderValue(selectedPercentage)
      setUnstakeTokenAmount(unstakeAmount)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPercentage])

  useEffect(() => {
    if (sliderValue) {
      const unstakeAmount = (parseFloat(userStakedDetails?.stakedAmount) * parseInt(sliderValue)) / 100
      setUnstakeTokenAmount(unstakeAmount)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue])

  useEffect(() => {
    if (parseFloat(unstakeTokenAmount) > parseFloat(userStakedDetails?.stakedAmount)) {
      setUnStakeAmountValidationMessage('Can not exceed maximum staked limit')
      setUnStakeAmountValidationStatus('error')
    } else {
      setUnStakeAmountValidationMessage('')
      setUnStakeAmountValidationStatus(null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unstakeTokenAmount])

  return (
    <Modal
      title={t("Unstake Tokens")}
      visible={isUnStakingAmountModelVisible}
      onOk={handleModelClose}
      onCancel={handleModelClose}
      footer={false}>
      <div>
        <div className='staking-token-details d-flex justify-content-between' style={{ padding: '10px' }}>
          <div className='stake-token-data primary-text'>
            {t('Unstake Your Tokens')}
          </div>
          <div className='stake-token-value'>
            {stakedTokenDetails?.tokenName}
          </div>
        </div>
        <Card className='kingsale-card-bg'>
          <Row>
            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
              <div
                style={{ padding: '2px 5px', fontSize: '10px' }}
                className='maximum-token-stake-limit d-flex justify-content-between'>
                <div className='stake-limit-label'>
                  {t('Maximum unstake limit : ')}
                </div>

                <div className='stake-limit-value'>
                  <NumberFormat
                    displayType='text'
                    value={userStakedDetails?.stakedAmount}
                    decimalScale={2}
                    thousandSeparator={true}
                    suffix={` ${stakedTokenDetails?.tokenSymbol}`}
                  />
                </div>
              </div>


              <Form.Item
                validateStatus={unStakeAmountValidationStatus}
                help={unStakeAmountValidationMessage}
                style={{ marginBottom: '0px' }}
              >
                <Input
                  lang='en'
                  type="number"
                  name="stakedTokenAmount"
                  suffix={stakedTokenDetails?.tokenSymbol}
                  value={unstakeTokenAmount}
                  onChange={(e) => setUnstakeTokenAmount(e.target.value)}
                  placeholder="0.00" />
              </Form.Item>
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
              <Button
                loading={isUnStakingLoading}
                onClick={handleUnstakeToken}
                disabled={parseFloat(unstakeTokenAmount) > parseFloat(userStakedDetails?.stakedAmount)}
                size="large"
                block
                className='kingsale-primary-button'>
                {t('Unstake')}
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  )
}

export default UnstakeTokenModal