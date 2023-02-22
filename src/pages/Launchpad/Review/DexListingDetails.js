import React from 'react'
import { Card } from 'antd'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';

function DexListingDetails(props) {

    const { t } = useTranslation();
    const {
        liquidityProvider,
        tokensPerBNB,
        tokenSymbol,
        launchRate,
        softCap,
        liquidityTokenName,
        hardCap,
        minimumBuy,
        maximumBuy,
        liquidityPercentage,
        startTime,
        endTime,
        liquidityUnlockTime,
        isWhitelistingEnabled,
        publicStartTime
    } = props

    return (
        <div>
            <Card title="Dex Listing Details" className='review-info-card mt-4'>
                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Router')}</p>
                    </div>

                    <div className='text-end'>
                        {liquidityProvider ? liquidityProvider : t('N/A')}
                    </div>
                </div>


                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Presale Rate')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={tokensPerBNB ? tokensPerBNB : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + tokenSymbol}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Listing Rate')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={launchRate ? launchRate : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + tokenSymbol}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Soft Cap')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={softCap ? softCap : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + liquidityTokenName}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Hard Cap')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={hardCap ? hardCap : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + liquidityTokenName}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Minimum buy')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={minimumBuy ? minimumBuy : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + liquidityTokenName}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Maximum buy')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={maximumBuy ? maximumBuy : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + liquidityTokenName}
                        />
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Liquidity')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={liquidityPercentage ? liquidityPercentage : 0.0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={"%"}
                        />
                    </div>
                </div>


                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Start time (UTC)')}</p>
                    </div>

                    <div className='text-end'>
                        {startTime ? startTime : t('N/A')}
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('End time (UTC)')}</p>
                    </div>

                    <div className='text-end'>
                        {endTime ? endTime : t('N/A')}
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Liquidity Unlock After')}</p>
                    </div>

                    <div className='text-end'>
                        {liquidityUnlockTime ? liquidityUnlockTime : t('N/A')} {t('days')}
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>Is Whitelisting Enabled</p>
                    </div>

                    <div className='text-end'>
                        {isWhitelistingEnabled ? t('Yes') : t('No')}
                    </div>
                </div>

                {
                    isWhitelistingEnabled ? (
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Public Sales Start At')}</p>
                            </div>

                            <div className='text-end'>
                                {publicStartTime ? publicStartTime : t('N/A')}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )
                }

            </Card>
        </div>
    )
}

export default DexListingDetails