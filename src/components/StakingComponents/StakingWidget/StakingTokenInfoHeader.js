import React from 'react'
import { getTruncatedTxt } from '../../../helpers/Formatters'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next';

export default function StakingTokenInfoHeader(props) {
  const { poolData } = props
  const { t } = useTranslation()
  return (
    <div>
      <h6 className='primary-text hide-on-mobile'>
        {t('Earn ')}
        <Tooltip title={poolData?.rewardsTokenName}>
          {getTruncatedTxt(poolData?.rewardsTokenName, 20)}
        </Tooltip>
      </h6>

      <h6 className='primary-text hide-on-pc'>
        {t('Earn ')}
        <Tooltip title={poolData?.rewardsTokenName}>
          {getTruncatedTxt(poolData?.rewardsTokenName, 25)}
        </Tooltip>
      </h6>


      <span className='fw-bold'>
        {t('Stake')} {poolData?.stakingTokenName}</span><br />
      <span className='small'>
        {t('Reflection')} {poolData?.rewardsTokenSymbol}
      </span>
    </div>
  )
}
