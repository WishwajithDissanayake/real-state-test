import React from 'react'
import { Progress, Spin } from 'antd'
import { Row, Col } from 'reactstrap'
import usePoolProgressDetails from '../../Hooks/usePoolProgressDetails'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'

function ProgressBarComponent(props) {
    const { poolAddress, poolDetails } = props
    const {
        isLoading: isPoolProgressDetailsLoading,
        poolProgressDetails
    } = usePoolProgressDetails({ poolAddress })
    const { t } = useTranslation();

    const { theme } = useSelector((state) => state.themeState)

    return (
        <div>

            {
                isPoolProgressDetailsLoading ? (
                    <div className='text-center'>
                        <Spin size="small" />
                    </div>
                ) : (
                    <div>
                        <span className="mt-3 text-muted">{t('Progress')} (  <NumberFormat
                            value={poolProgressDetails ? poolProgressDetails.progressPercentage : 0.0}
                            displayType={'text'}
                            decimalScale={2}
                            suffix=" %"
                        />

                            )</span> <br />

                        <span className="mt-3 text-muted">
                            <NumberFormat
                                value={poolProgressDetails ? poolProgressDetails.bnbFilledSoFar : 0.0}
                                displayType={'text'}
                                decimalScale={4}
                                suffix={' ' + poolDetails?.liquidityTokenName}
                            /> {t('filled so far')}
                        </span>
                        <Progress
                            percent={poolProgressDetails ? poolProgressDetails.progressPercentage : 0.0}
                            showInfo={false}
                            strokeColor="#e6bd4f"
                            status="active"
                            trailColor={theme === 'light' ? "#d9d9d9" : "#1f1f1f"}
                        />

                        <Row className="text-muted">
                            <Col>
                                0.0 {poolDetails?.liquidityTokenName}
                            </Col>

                            <Col className="text-end">
                                {poolProgressDetails ? poolProgressDetails.hardCap : 0.0} {poolDetails?.liquidityTokenName}
                            </Col>
                        </Row>
                    </div>
                )
            }
        </div>
    )
}

export default ProgressBarComponent