import React from 'react'
import { Card, Spin } from 'antd'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';

function LPLockInfo(props) {

    const { liquidityTokenDetails, pairAddress, isTokenDetailsLoading } = props
    const { t } = useTranslation();

    return (

        <Card title={<h5>{t('Lock Info')}</h5>} className='kingsale-card-bg'>

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
                                    value={liquidityTokenDetails ? liquidityTokenDetails.totalTokensLocked : 0}
                                    displayType={'text'}
                                    suffix={liquidityTokenDetails ? ' ' + liquidityTokenDetails.tokenSymbol : ''}
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
                                <span>{t('Liquidity Address')}</span>
                            </div>

                            <div>
                                <a
                                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${pairAddress}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='break-text'
                                >
                                    {liquidityTokenDetails?.tokenAddress}
                                </a>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Pair Name')}</span>
                            </div>

                            <div>
                                <a
                                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${pairAddress}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='break-text'
                                >
                                    {
                                        liquidityTokenDetails && liquidityTokenDetails.lockRecords.length > 0 ? (
                                            <>{liquidityTokenDetails.lockRecords[0].tokenAddressOneSymbol} / {liquidityTokenDetails.lockRecords[0].tokenAddressTwoSymbol}</>
                                        ) : (
                                            <>~</>
                                        )
                                    }
                                </a>
                            </div>
                        </div>
                        <hr />

                        <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>{t('Dex')}</span>
                            </div>

                            <div>
                                {liquidityTokenDetails?.dexPlatform}
                            </div>
                        </div>
                        <hr />
                    </div>
                )
            }
        </Card >

    )
}

export default LPLockInfo