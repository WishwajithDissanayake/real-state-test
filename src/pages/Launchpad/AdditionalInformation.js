import React, { useState, useEffect } from 'react'
import {
    Button,
    Form,
    Input,
    Upload,
    Checkbox,
    DatePicker,
    Select,
    Alert,
    Card,
} from 'antd'
import { Row, Col } from 'reactstrap'
import moment from 'moment'

function AdditionalInformation(props) {

    const {
        propertyPrice,
        setPropertyPrice,
        tokensPerUSD,
        setTokensPerUSD,
        minimumBuy,
        setMinimumBuy,
        maximumBuy,
        setMaximumBuy,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        isWhitelistingEnabled,
        setIsWhitelistingEnabled,
        publicSaleStartTime,
        setPublicSaleStartTime,
        setStepNumberParent,
    } = props

    const [startDateValidationStatus, setStartDateValidationStatus] = useState(null)
    const [startDateValidationMessage, setStartDateValidationMessage] = useState(null)

    const [canProceedToNextStep, setCanProceedToNextStep] = useState(false)

    const [endDateValidationStatus, setEndDateValidationStatus] = useState(null)
    const [endDateValidationMessage, setEndDateValidationMessage] = useState(null)

    const [publicStartValidationStatus, setPublicStartValidationStatus] = useState(null)
    const [publicStartValidationMessage, setPublicStartValidationMessage] = useState(null)

    const [minMaxBuyValidationStatus, setMinMaxBuyValidationStatus] = useState(null)
    const [minMaxBuyValidationMessage, setMinMaxBuyValidationMassage] = useState(null)

    const isPublicSaleStartTimeValid = true

    useEffect(() => {
        if (parseFloat(minimumBuy) >= parseFloat(maximumBuy)) {
            setMinMaxBuyValidationMassage(('Minimum buy amount can not be grate than maximum buy amount'))
            setMinMaxBuyValidationStatus('error')
            setCanProceedToNextStep(false)
        } else {
            setMinMaxBuyValidationMassage(null)
            setMinMaxBuyValidationStatus('success')
            setCanProceedToNextStep(true)
        }

    }, [minimumBuy, maximumBuy])

    const onChangeStartDate = (value, dateString) => {
        // comparison with the end time and public sale start time
        if (endTime && moment(dateString).isSameOrAfter(endTime)) {
            setStartDateValidationStatus('error')
            setStartDateValidationMessage('Start Time should be less than End Time')
            setCanProceedToNextStep(false)
        } else if (publicSaleStartTime && moment(dateString).isAfter(publicSaleStartTime)) {
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
        } else if (publicSaleStartTime && moment(dateString).isSameOrBefore(publicSaleStartTime)) {
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

    const onChangePublicSaleStartTime = (value, dateString) => {
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
            setPublicSaleStartTime(dateString)
            setEndDateValidationStatus('success')
            setPublicStartValidationMessage(null)
            setCanProceedToNextStep(true)
        }
    }

    const onFinish = (values) => {
        setStepNumberParent(2)
        console.log(values, 'aditional information');
    }

    return (
        <div>
            <div className='mb-2'>
                <span className='text-validation-error'>(*) {('is required field.')}</span>
            </div>
            <Form
                name="presale_info"
                onFinish={onFinish}
            >
                <Row>
                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Property Price (USD)')}  <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            hasFeedback
                            // help={minMaxBuyValidationMessage}
                            // validateStatus={minMaxBuyValidationStatus}
                            value={propertyPrice}
                            onChange={e => setPropertyPrice(e.target.value)}
                            name="propertyPrice"
                            rules={[
                                {
                                    required: true,
                                    message: ('This is a required field!'),
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
                        <span className='small'>{('Tokens per USD')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="tokensPerUSD"
                            value={tokensPerUSD}
                            onChange={e => setTokensPerUSD(e.target.value)}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: (`Please enter tokens per $ amount`),
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
                        <span className='small'>{('Minimum Buy')}  <span className='required-field-warning'>*</span></span>
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
                                    message: ('This is a required field!'),
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
                        <span className='small'>{('Maximum Buy')}  <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            hasFeedback
                            help={minMaxBuyValidationMessage}
                            validateStatus={minMaxBuyValidationStatus}
                            name="maximumBuy"
                            value={maximumBuy}
                            onChange={e => setMaximumBuy(e.target.value)}
                            rules={[
                                {
                                    required: true,
                                    message: ('This is a required field!'),
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
                        //   value={maximumBuy}
                        >
                            <Input lang='en' type="number" size="large" />
                        </Form.Item>
                    </Col>

                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Start time')} (UTC {moment().utc().format('yyyy-MM-DD HH:mm:ss').toString()} {('Now')}) <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="startTime"
                            hasFeedback
                            validateStatus={startDateValidationStatus}
                            help={startDateValidationMessage}
                            rules={[
                                {
                                    required: true,
                                    message: ('This is a required field!'),
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
                        <span className="small">{('End time')} (UTC) <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="endTime"
                            hasFeedback
                            validateStatus={endDateValidationStatus}
                            help={endDateValidationMessage}
                            rules={[
                                {
                                    required: true,
                                    message: ('This is a required field!'),
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

                    <Col lg="12" md="12" sm="12">
                        <Form.Item
                            name="whitelisting"
                        >
                            <Checkbox
                                checked={isWhitelistingEnabled}
                                onChange={e => setIsWhitelistingEnabled(e.target.checked)}
                            // disabled={!isNextButtonActive}
                            >
                                {('Enable Whitelisting Feature')}
                            </Checkbox>
                        </Form.Item>
                    </Col>

                    <Col lg="6" md="6" sm="12">
                        <span className="small">{('Public Sale Start Time (UTC)')}
                            {
                                isWhitelistingEnabled ? (
                                    <span className='required-field-warning'> *</span>
                                ) : (
                                    <></>
                                )
                            }
                        </span>
                        <Form.Item
                            name="publicSaleStartTime"
                            hasFeedback
                            validateStatus={publicStartValidationStatus}
                            help={publicStartValidationMessage}
                            rules={[
                                {
                                    required: isWhitelistingEnabled ? true : false,
                                    message: ('This is a required field!'),
                                },
                            ]}
                        >
                            <DatePicker
                                size='large'
                                className="input-background-inside-form col-12"
                                format={date => date.utc().format('YYYY-MM-DD HH:mm:ss')}
                                disabledDate={d => !d || d.isBefore(moment().utc().format('yyyy-MM-DD').toString())}
                                onChange={onChangePublicSaleStartTime}
                                disabled={!isWhitelistingEnabled}
                                showTime
                            />
                        </Form.Item>
                        <div className='remove-margin-top'>
                            {
                                !isPublicSaleStartTimeValid ? (
                                    <span className="text-validation-error">{('Public sale should start after the pool started')}</span>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </Col>

                    <Row>
                        <Col lg="12" md="12" sm="12" className='text-end mt-3'>
                            <Form.Item>
                                <Button onClick={() => setStepNumberParent(0)} style={{ marginRight: '5px' }}>Back</Button>
                                <Button
                                    type="primary"
                                    htmlType='submit'
                                    disabled={!canProceedToNextStep}
                                    onClick={() => setStepNumberParent(2)}
                                >Next</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Row>
            </Form>
        </div>
    )
}

export default AdditionalInformation