import { Card, Alert } from 'antd'
import React, { useState } from 'react'
import CountDownLarge from '../../components/Countdown/CountDownLarge'
import usePoolStatus from '../../Hooks/usePoolStatus'
import { DateTime } from 'luxon'
import PoolProgressBar from '../../components/ProgressBarComponent/PoolProgressBar'
import BuyWithBNBWidget from './BuyWithBNBWidget'
import ClaimAndExitButton from './ClaimAndExitButton'
import ClaimButtons from './ClaimButtons'
import { useTranslation } from 'react-i18next';
import UserPresaleWhiteListedAlert from './UserPresaleWhiteListedAlert'
import ClaimVestingButton from './ClaimVestingButton'

function ContributionWidget(props) {

    const { t } = useTranslation();
    const { presaleAddress, presaleSaleDetails, shouldForcedRefresh, setShouldForcedRefresh } = props
    const { isLoading: isPoolStatusLoading, poolStatus } = usePoolStatus({
        poolAddress: presaleAddress,
        offChainPoolDetails: presaleSaleDetails,
        forcedRefresh: shouldForcedRefresh
    })
    const [maxContributionAmount, setMaxContributionAmount] = useState(0.0)
    const [minContributionAmount, setMinContributionAmount] = useState(0.0)
    const [isPoolDataLoading, setIsPoolDataLoading] = useState(false)


    return (
        <div>
            <Card className="mt-2 kingsale-card-bg">

                <Alert message="Confirm page is KingSale.Finance before contribution." type="info" className='text-center' />

                <div className='text-center'>
                    {
                        poolStatus?.statusCode === 'upcoming' ? (
                            <div className='cd-timer-title d-flex justify-content-center mb-2'>
                                {t('Sales Start In')}
                            </div>
                        ) : (<></>)
                    }

                    <div className='d-flex justify-content-center'>
                        {
                            poolStatus?.statusCode === 'upcoming' ? (
                                <CountDownLarge
                                    startTime={presaleSaleDetails ? presaleSaleDetails?.startTimeTimestamp : DateTime.now().toSeconds()} />
                            ) : (<></>)
                        }
                    </div>
                </div>

                {
                    poolStatus?.statusCode === 'live'
                        && parseInt(presaleSaleDetails?.publicSaleStartTimestamp) > parseInt(DateTime.now().toSeconds()) ? (
                        <div className='mt-4'>
                            <div className='cd-timer-title d-flex justify-content-center mb-2'>
                                {t('Public Sales Starts In')}
                            </div>
                            <div className='d-flex justify-content-center'>
                                <CountDownLarge
                                    startTime={presaleSaleDetails ? presaleSaleDetails?.publicSaleStartTimestamp : DateTime.now().toSeconds()} />
                            </div>
                        </div>
                    ) :
                        (
                            <></>
                        )
                }

                {
                    poolStatus?.statusCode === 'live' &&
                        parseInt(presaleSaleDetails?.endTimeTimestamp) > parseInt(DateTime.now().toSeconds()) ? (
                        <div className='mt-4'>
                            <div className='cd-timer-title d-flex justify-content-center mb-2'>
                                {t('Public Sales Ends In')}
                            </div>
                            <div className='d-flex justify-content-center'>
                                <CountDownLarge
                                    startTime={presaleSaleDetails ? presaleSaleDetails?.endTimeTimestamp : DateTime.now().toSeconds()} />
                            </div>
                        </div>
                    ) :
                        (
                            <></>
                        )
                }

                <div className='mt-4'>
                    <PoolProgressBar
                        presaleDetails={presaleSaleDetails}
                        poolAddress={presaleAddress}
                        setIsPoolDataLoading={setIsPoolDataLoading}
                        setMaxContributionAmount={setMaxContributionAmount}
                        setMinContributionAmount={setMinContributionAmount}
                    />
                </div>

                <div className='mt-4'>
                    <UserPresaleWhiteListedAlert presaleDetails={presaleSaleDetails} />
                </div>

                <div className='mt-3'>
                    <BuyWithBNBWidget
                        setShouldForcedRefresh={setShouldForcedRefresh}
                        minContributionAmount={minContributionAmount}
                        maxContributionAmount={maxContributionAmount}
                        isPoolStatusLoading={isPoolStatusLoading}
                        poolStatus={poolStatus}
                        isPoolDataLoading={isPoolDataLoading}
                        poolAddress={presaleAddress}
                        presaleSaleDetails={presaleSaleDetails}
                    />
                    {/* <Input suffix={<Tag color="yellow">MAX</Tag>} placeholder="0.0" type="number" /> */}
                </div>

                <div className='mt-3'>
                    <ClaimAndExitButton
                        shouldForcedRefresh={shouldForcedRefresh}
                        setShouldForcedRefresh={setShouldForcedRefresh}
                        isPoolStatusLoading={isPoolStatusLoading}
                        liquidityTokenName={presaleSaleDetails ? presaleSaleDetails.liquidityTokenName : 'BNB'}
                        poolStatus={poolStatus}
                        poolAddress={presaleAddress}
                    />
                    {/* <Input suffix={<Tag color="yellow">MAX</Tag>} placeholder="0.0" type="number" /> */}
                </div>

                <div className='mt-3'>
                    <ClaimButtons
                        setShouldForcedRefresh={setShouldForcedRefresh}
                        shouldForcedRefresh={shouldForcedRefresh}
                        isPoolStatusLoading={isPoolStatusLoading}
                        liquidityTokenName={presaleSaleDetails ? presaleSaleDetails.liquidityTokenName : 'BNB'}
                        poolStatus={poolStatus}
                        poolAddress={presaleAddress}
                    />
                    {/* <Input suffix={<Tag color="yellow">MAX</Tag>} placeholder="0.0" type="number" /> */}
                </div>

                <div className='mt-3'>
                    <ClaimVestingButton
                        presaleSaleDetails={presaleSaleDetails}
                        setShouldForcedRefresh={setShouldForcedRefresh}
                        shouldForcedRefresh={shouldForcedRefresh}
                        isPoolStatusLoading={isPoolStatusLoading}
                        liquidityTokenName={presaleSaleDetails ? presaleSaleDetails.liquidityTokenName : 'BNB'}
                        poolStatus={poolStatus}
                        poolAddress={presaleAddress}
                    />
                    {/* <Input suffix={<Tag color="yellow">MAX</Tag>} placeholder="0.0" type="number" /> */}
                </div>

                <div className='mt-3'>
                    {/* <ClaimRewardsButton
                        liquidityTokenName={presaleSaleDetails ? presaleSaleDetails.liquidityTokenName : 'BNB'}
                        isPoolStatusLoading={isPoolStatusLoading}
                        poolStatus={poolStatus}
                        shouldForcedRefresh={shouldForcedRefresh}
                        poolAddress={presaleAddress}
                    /> */}
                    {/* <Input suffix={<Tag color="yellow">MAX</Tag>} placeholder="0.0" type="number" /> */}
                </div>
            </Card>
        </div>
    )
}

export default ContributionWidget