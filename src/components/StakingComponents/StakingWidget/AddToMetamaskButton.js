import React from 'react'
import MetamaskLogo from '../../../images/MetaMask_Fox.png'
import { useTranslation } from 'react-i18next'

export default function AddToMetamaskButton(props) {

  const handleAddToMetamask = () => {
    const { poolData } = props
    const tokenData = {
      type: 'ERC20',
      options: {
        address: poolData?.rewardsTokenAddress,
        symbol: poolData?.rewardsTokenSymbol,
        decimals: poolData?.rewardsTokenDecimals,
      },
    }
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: tokenData,
      id: Math.round(Math.random() * 100000),
    })
  }

  const { t } = useTranslation()
  return (
    <div>
      <div className='text-end small'>
        <span type='link' onClick={handleAddToMetamask} style={{ color: '#e6bd4f', cursor: 'pointer' }}>
          {t('Add to Metamask')} <img src={MetamaskLogo} alt="metamask-fox" style={{ width: '14px' }} />
        </span>
      </div>
    </div>
  )
}
