import React from 'react'
import { useTranslation } from 'react-i18next';

function Disclaimer() {

  const { t } = useTranslation();

  return (
    <span className='small'>
        {t('DISCLAIMER')}
    </span>
  )
}

export default Disclaimer