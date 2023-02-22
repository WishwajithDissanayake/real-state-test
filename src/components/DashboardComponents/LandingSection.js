import React from 'react'
import { Button } from 'antd'
import Bull from '../../images/Bull.png'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

function LandingSection() {

  const { t } = useTranslation();

  return (
    <div>
      <div className='container-fluid'>
        <img src={Bull}
          alt="landing bull"
          className="hide-on-pc landing-section-image mb-4" />

        <div className='text-center'>
          <img src={Bull}
            alt="landing bull"
            className="mt-4 mb-4 hide-on-mobile mx-auto col-lg-6" />
        </div>

        <div className='text-center col-lg-10 mt-lg-4 mx-auto'>
          <h1 className='text-uppercase primary-text fw-bold'>{t('Welcome To Kingsale')}</h1>
          <h4 className='fw-bold'>{t('A Decentralized Launchpad that is fit for a King')}</h4>
          <p className='mt-lg-5'>{t('LANDING_WELCOME_TEXT')}</p>

          <div className='mt-4'>

            <Link to="/create-presale">
              <Button className='kingsale-primary-button fw-bold text-uppercase' size='large' style={{ marginRight: '10px' }}>{t('Create Now')}</Button>
            </Link>

            <a href="https://docs.kingsale.finance/" target="_blank" rel="noreferrer">
              <Button className='kingsale-primary-button fw-bold text-uppercase' size='large'>{t('Learn More')}</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingSection