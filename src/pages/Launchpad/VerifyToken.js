import React, { useEffect } from 'react'
import { Button, Form, Input, Select, Spin } from 'antd'
import { Row, Col } from 'reactstrap'
import { preSaleConfigs } from '../../Blockchain/configs/presale.config'
import { useTranslation } from 'react-i18next';

function VerifyToken(props) {

    const { t } = useTranslation();
    const {
        setStepNumberParent,
        tokenAddress,
        setTokenAddress,
        tokenValidationStatus,
        tokenValidationHelperMessage,
        isTokenDetailsLoading,
        liquidityToken,
        setLiquidityToken,
        tokenName,
        tokenSymbol,
        userTokenBalance,
        tokenDecimals,
        totalSupply,
        yourBalanceValidationStatus,
        yourBalanceValidationHelperMessage,
        setIsNextButtonActive,
        isNextButtonActive,
        setLiquidityTokenName
    } = props

    const { liquidityTokenList } = preSaleConfigs

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const onFinish = (values) => {
        console.log(values)
    }

    useEffect(() => {
        if (userTokenBalance && tokenName) {
            setIsNextButtonActive(true)
        } else {
            setIsNextButtonActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userTokenBalance, tokenName])

    const { Option } = Select;

    const handleLiquidityTokenChange = (value) => {
        const result = liquidityTokenList.filter(item => {
            return item.tokenAddress === value
        })
        setLiquidityToken(result[0].tokenAddress)
        setLiquidityTokenName(result[0].tokenName)
    };

    return (
        <div>
            <div className='mb-2'>
                <span className='text-validation-error'>(*) {t('is required field.')}</span>
            </div>

            <Form
                name="verify_token"
                onFinish={onFinish}
                initialValues={{
                    tokenAddress: tokenAddress,
                    tokenName: tokenName,
                    tokenSymbol: tokenSymbol,
                    totalSupply: totalSupply,
                    tokenDecimals: tokenDecimals,
                    userTokenBalance: userTokenBalance,
                    liquidityToken: liquidityToken
                }}
            >
                <Row>
                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{t('Token Address')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
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
                    </Col>

                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{t('Liquidity Token')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="liquidityToken"
                        >
                            <Select
                                onChange={handleLiquidityTokenChange}
                                size="large"
                            >
                                {
                                    liquidityTokenList.map(item => (
                                        <Option
                                            value={item.tokenAddress}
                                            key={item.tokenName}>
                                            {item.tokenName}
                                        </Option>
                                    ))
                                }

                            </Select>
                        </Form.Item>
                    </Col>

                    {
                        isTokenDetailsLoading ? (
                            <div className='d-flex justify-content-center'>
                                <Spin />
                            </div>
                        ) : (
                            <>
                                <Col lg="6" md="6" sm="12">
                                    <span className='small'>{t('Token Name')}</span>
                                    <Form.Item>
                                        <Input
                                            lang='en'
                                            name="tokenName"
                                            value={tokenName}
                                            readOnly
                                            size='large' />
                                    </Form.Item>
                                </Col>

                                <Col lg="6" md="6" sm="12">
                                    <span className='small'>{t('Token Symbol')}</span>
                                    <Form.Item>
                                        <Input
                                            lang='en'
                                            name="tokenSymbol"
                                            value={tokenSymbol}
                                            readOnly
                                            size='large' />
                                    </Form.Item>
                                </Col>

                                <Col lg="6" md="6" sm="12">
                                    <span className='small'>{t('Total Supply')}</span>
                                    <Form.Item>
                                        <Input
                                            lang='en'
                                            name="totalSupply"
                                            value={totalSupply}
                                            readOnly
                                            size='large' />
                                    </Form.Item>
                                </Col>

                                <Col lg="6" md="6" sm="12">
                                    <span className='small'>{t('Token Decimals')}</span>
                                    <Form.Item>
                                        <Input
                                            lang='en'
                                            name="tokenDecimals"
                                            value={tokenDecimals}
                                            readOnly
                                            size='large' />
                                    </Form.Item>
                                </Col>

                                <Col lg="6" md="6" sm="12">
                                    <span className='small'>{t('Your Token Balance')}</span>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={yourBalanceValidationStatus}
                                        help={yourBalanceValidationHelperMessage}
                                    >
                                        <Input
                                            lang='en'
                                            name="userTokenBalance"
                                            value={userTokenBalance}
                                            readOnly size='large' />
                                    </Form.Item>
                                </Col>
                            </>
                        )
                    }


                    <Col lg="12" md="12" sm="12" className='text-end'>
                        <Form.Item>
                            <Button type="primary" disabled={!isNextButtonActive} onClick={() => setStepNumberParent(1)}>{t('Next')}</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default VerifyToken