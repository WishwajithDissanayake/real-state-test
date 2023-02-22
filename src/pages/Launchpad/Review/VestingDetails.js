import React from "react"
import { Card } from 'antd'
import { useTranslation } from 'react-i18next';

function VestingDetails(props) {

    const { t } = useTranslation();
    const {
        isVestingEnabled,
        initialTokenReleasePercentage,
        vestingCyclesInDays,
        tokenReleasePercentageInCycle
    } = props

    return (
        <div>
            <Card title="Vesting Details" className='review-info-card mt-4'>

                <div className='d-flex justify-content-between'>
                    <div className='text-start'>
                        <p>{t('Vesting Enabled')}</p>
                    </div>

                    <div className='text-end'>
                        {isVestingEnabled ? t('Yes') : t('No')}
                    </div>
                </div>

                {isVestingEnabled &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('First release for presale (percent)')}</p>
                        </div>

                        <div className='text-end'>
                            {initialTokenReleasePercentage ? initialTokenReleasePercentage + '%' : t('N/A')}
                        </div>
                    </div>
                }

                {isVestingEnabled &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('Vesting period each cycle (days)')}</p>
                        </div>

                        <div className='text-end'>
                            {vestingCyclesInDays ? vestingCyclesInDays : t('N/A')}
                        </div>
                    </div>
                }

                {isVestingEnabled &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('Presale token release each cycle (percent)')}</p>
                        </div>

                        <div className='text-end'>
                            {tokenReleasePercentageInCycle ? tokenReleasePercentageInCycle + '%' : t('N/A')}
                        </div>
                    </div>
                }
            </Card>
        </div>
    )
}

export default VestingDetails