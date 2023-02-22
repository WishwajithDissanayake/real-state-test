import { Card, Spin } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next';

function TokenLockRecordTokenInfo(props) {

    const { tokenLockDetailsOnChain, isTokenDataLoading } = props
    const { t } = useTranslation();

    return (
        <div>
            <Card title="Token Info" className='kingsale-card-bg'>

                {
                    isTokenDataLoading ? (
                        <div className='d-flex justify-content-center loader'>
                            <Spin size='medium' />
                        </div>
                    ) : (
                        <div>
                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Token Address')}</span>
                                </div>

                                <div>
                                    <a
                                        href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${tokenLockDetailsOnChain?.tokenAddress}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='break-text'
                                    >
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenAddress : ''}
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
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenName : ''}
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
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenSymbol : ''}
                                    </span>
                                </div>
                            </div>
                            <hr />

                            <div className='d-md-flex justify-content-between'>
                                <div>
                                    <span>{t('Token Decimals')}</span>
                                </div>

                                <div>
                                    <span>
                                        {tokenLockDetailsOnChain ? tokenLockDetailsOnChain.tokenDecimals : ''}
                                    </span>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )

                }

            </Card>
        </div>
    )
}

export default TokenLockRecordTokenInfo