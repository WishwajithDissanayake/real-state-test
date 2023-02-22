import { Card, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next'
import { calculatePresalePieChart } from '../../Blockchain/services/presale.service';

function TokenMetrics(props) {

  const { presaleDetails } = props
  const [tokenMetrics, setTokenMetrics] = useState([])
  const [isTokenMetricsLoading, setIsTokenMetricsLoading] = useState(false)

  useEffect(() => {
    if (presaleDetails) {
      fetchPresaleTokenMetrics(presaleDetails)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presaleDetails])

  const fetchPresaleTokenMetrics = async () => {
    try {
      setIsTokenMetricsLoading(true)
      const dataResponse = await calculatePresalePieChart(presaleDetails)
      setTokenMetrics(dataResponse)
      setIsTokenMetricsLoading(false)
    } catch (error) {
      console.log("ERROR while calculating token metric data ", error)
      setIsTokenMetricsLoading(false)
    }
  }

  const { t } = useTranslation()
  const config = {
    autoFit: true,
    appendPadding: 10,
    data: tokenMetrics ? tokenMetrics.filter(element => element.value !== 0) : [],
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: window.screen.availWidth < 768 ? 14 : 20,
          paddingBottom: '3px'
        },
        content: presaleDetails?.tokenName,
      },
    },
    legend: {
      position: 'right',
      itemHeight: 20,
      itemName: {
        style: {
          fontSize: window.screen.availWidth < 768 ? 10 : 16,
          fontWeight: window.screen.availWidth < 768 ? 400 : 600,
        },
      },
      marker: {
        symbol: 'circle',
      }
    }
  };

  return (
    <div>
      <Card className="mt-2 kingsale-card-bg">
        <h6>{t('Token Index')}</h6>
        <hr />
        {
          isTokenMetricsLoading ? (
            <div className='d-flex justify-content-center'>
              <Spin />
            </div>
          ) : (
            <Pie {...config} />
          )
        }

      </Card>
    </div>
  )
}

export default TokenMetrics