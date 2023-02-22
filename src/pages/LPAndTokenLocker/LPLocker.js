import {
  Card,
} from 'antd'
import React, { useEffect } from 'react'
import LPLockerForm from '../../components/LPAndTokenLocker/LPLocker/LPLockerForm'
import logo from '../../images/kingsfund.png'
import { Check } from 'react-feather'
import { useTranslation } from 'react-i18next';

function LiquidityLocker() {

  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='mb-5'>

      {/* <h2 className='text-center mt-4 mb-4 primary-text'>Liquidity Locker</h2> */}
      <Card className='kingsale-card-bg mt-5'>

        <div className='mb-4 mt-3'>
          <div className='d-flex'>
          <div style={{marginTop: '-3px'}} className="hide-on-mobile">
              <img
              alt="kings-sales-dex-platform"
              src={logo}
              style={{ width: '40px', marginRight: '10px' }} />
          </div>

          <div style={{marginTop: '-5px'}} className="hide-on-pc">
              <img
              alt="kings-sales-dex-platform"
              src={logo}
              style={{ width: '40px', marginRight: '10px' }} />
          </div>
            <h3>{t('KingLock Liquidity')}</h3>
          </div>

          <span className='text-muted'>{t('The KingSale liquidity locker provides assurance to both you and your investors that the presale funds set aside for liquidity are secured.')}</span>

          <p className='mt-3 text-muted fw-bold'>{t('Our Locking service offers:')}</p>

          <p className='text-muted'><Check color='#e6bd4f' size={16} /> {t('Lock Splitting')}</p>
          <p className='text-muted'><Check color='#e6bd4f' size={16} /> {t('Liquidity Migration')}</p>
          <p className='text-muted'><Check color='#e6bd4f' size={16} /> {t('Relocking')}</p>
          <p className='text-muted'><Check color='#e6bd4f' size={16} /> {t('Lock Ownership Transfer')}</p>

        </div>

        <LPLockerForm />
      </Card>
    </div >
  )
}

export default LiquidityLocker