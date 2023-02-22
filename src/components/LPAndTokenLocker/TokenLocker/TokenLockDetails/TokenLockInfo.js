import React from 'react'
import { Card, Spin } from 'antd'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';

function TokenLockInfo(props) {

    const { tokenAddress, tokenDetails, isTokenDetailsLoading } = props
    const { t } = useTranslation();

    return (

        <Card title={<h5>Lock Info</h5>} className='kingsale-card-bg'>
            {
                isTokenDetailsLoading ? (
                    <div className='d-flex justify-content-center loader'>
                        <Spin size='medium' />
                    </div>
                ) : (
                    <div>
                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Current Locked Amount')}</span>
                            </div>

                            <div>
                                <NumberFormat
                                    value={tokenDetails ? tokenDetails.totalTokensLocked : 0}
                                    displayType={'text'}
                                    suffix={tokenDetails ? ' ' + tokenDetails.tokenSymbol : ''}
                                    thousandSeparator={true}
                                />
                            </div>

                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Current Values Locked')}</span>
                            </div>

                            <div>
                                <span>$0</span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Token Address')}</span>
                            </div>

                            <div>
                                <a
                                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${tokenAddress}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='break-text'
                                >
                                    {tokenDetails?.tokenAddress}
                                </a>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Token Name')}</span>
                            </div>

                            <div>
                                <span>
                                    {tokenDetails?.tokenName}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Token Symbol')}</span>
                            </div>

                            <div>
                                <span>
                                    {tokenDetails?.tokenSymbol}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Token Decimals')}</span>
                            </div>

                            <div>
                                <span>{tokenDetails?.tokenDecimals}</span>
                            </div>
                        </div>
                        <hr />
                    </div>
                )
            }

        </Card>

    )
}

export default TokenLockInfo