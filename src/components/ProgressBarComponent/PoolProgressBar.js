import React, { useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { Progress, Spin } from 'antd'
import usePoolProgressDetails from '../../Hooks/usePoolProgressDetails'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'


export default function PoolProgressBar(props) {
  const { poolAddress, setMaxContributionAmount, setIsPoolDataLoading, setMinContributionAmount, presaleDetails } = props
  const { isLoading: isPoolProgressDetailsLoading, poolProgressDetails } = usePoolProgressDetails({ poolAddress })
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.themeState)

  useEffect(() => {
    if (poolProgressDetails) {
      setMaxContributionAmount(poolProgressDetails?.maxContributionAmount)
      setMinContributionAmount(poolProgressDetails?.minContributionAmount)
    } else {
      setMaxContributionAmount(0.0)
      setMinContributionAmount(0.0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolProgressDetails])

  useEffect(() => {
    setIsPoolDataLoading(isPoolProgressDetailsLoading)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPoolProgressDetailsLoading])

  return (
    <div className='progress-bar-container mt-3'>

      {
        isPoolProgressDetailsLoading ? (
          <div className='text-center'>
            <Spin size="small" />
          </div>
        ) : (
          <div>

            <span className="mt-3 text-muted">{t('Progress')} (  <NumberFormat
              value={poolProgressDetails ? poolProgressDetails?.progressPercentage : 0.0}
              displayType={'text'}
              decimalScale={2}
              suffix=" %"
            />)</span> <br />

            <span className="mt-3 text-muted">
              <NumberFormat
                value={poolProgressDetails ? poolProgressDetails.bnbFilledSoFar : 0.0}
                displayType={'text'}
                decimalScale={4}
                suffix={' ' + presaleDetails?.liquidityTokenName}
              /> {t('filled so far')}
            </span>

            <Progress
              percent={poolProgressDetails ? poolProgressDetails?.progressPercentage : 0.0}
              showInfo={false}
              strokeColor="#e6bd4f"
              status="active"
              trailColor={ theme === 'light' ? "#d9d9d9" : "#1f1f1f"}
            />

            <Row className="text-muted">
              <Col>
                0.0 {presaleDetails?.liquidityTokenName}
              </Col>

              <Col className="text-end">
                {poolProgressDetails ? poolProgressDetails.hardCap : 0.0} {presaleDetails?.liquidityTokenName}
              </Col>
            </Row>
          </div>
        )
      }

    </div>
  )
}
