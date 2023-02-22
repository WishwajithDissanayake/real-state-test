import React from 'react'
import { Card } from 'antd'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';

function TokenMetadata(props) {

    const { t } = useTranslation();
    const {
        projectName,
        totalTokenNeeded,
        tokenSymbol,
        tokenName,
        tokenDecimals
    } = props

    return (
        <div>
            <Card title="Token Metadata" className='review-info-card'>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Project Name')}</p>
                    </div>

                    <div className='text-end'>
                        {projectName ? projectName : t('N/A')}
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Total Tokens')}</p>
                    </div>

                    <div className='text-end'>
                        <NumberFormat
                            value={totalTokenNeeded ? totalTokenNeeded : 0}
                            displayType={'text'}
                            decimalScale={3}
                            thousandSeparator={true}
                            suffix={" " + tokenSymbol}
                        />
                    </div>
                </div>


                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Token Name')}</p>
                    </div>

                    <div className='text-end'>
                        {tokenName ? tokenName : t('N/A')}
                    </div>
                </div>


                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Token Symbol')}</p>
                    </div>

                    <div className='text-end'>
                        {tokenSymbol ? tokenSymbol : t('N/A')}
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Token Decimals')}</p>
                    </div>

                    <div className='text-end'>
                        {tokenDecimals ? tokenDecimals : t('N/A')}
                    </div>
                </div>

            </Card>
        </div>
    )
    
}

export default TokenMetadata