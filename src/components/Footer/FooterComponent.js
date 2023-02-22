import React, { useState } from 'react'
import { Layout, Modal } from 'antd'
import { useTranslation } from 'react-i18next';

// footer logo
import rugfreecoins from '../../images/rfc.png'
// import kingsfund from '../../images/kingsale.png'

function FooterComponent() {

  const { Footer } = Layout
  const { t } = useTranslation();

  const [disclaimerModalOpen, setDislaimerModalOpen] = useState(false)

  const showModal = () => {
    console.log('hit')
    setDislaimerModalOpen(true);
  };
  const handleOk = () => {
    setDislaimerModalOpen(false);
  };
  const handleCancel = () => {
    setDislaimerModalOpen(false);
  };

  return (
    <>
      <Footer className='text-center footer-background'>
        <span className='presale-advanced-name'>{t('COPYRIGHT')} © {new Date().getFullYear()} {t('Developed by')}</span> <span className='primary-text presale-advanced-name'>rugfreecoins</span> <br /> <span className='presale-advanced-name'>{t('All rights reserved')}</span>
        {/* <span className='primary-text presale-advanced-name'>KingSale.</span> */}
        <br />

        <div className='mb-2'>
          <img src={rugfreecoins} alt="rugfree_coins_logo" style={{ width: "28px" }} />
          {/* <img src={kingsfund} alt="rugfree_coins_logo" style={{ width: "36px", marginLeft: '15px' }} /> */}
        </div>
        <span className='primary-text presale-advanced-name' style={{ cursor: 'pointer' }} onClick={() => showModal()}>Disclaimer</span>
      </Footer>

      <Modal title="Disclaimer" visible={disclaimerModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} width={1000}>
        <p className='small'>
          The information on this website was prepared by KingSale. While KingSale has taken care to ensure the information and opinions contained on this website are accurate,
          it does not make any representation or warranty (express or implied) as to the accuracy, reliability, or completeness of the information,
          and persons relying on the information do so at their own risk. To the extent permitted by law, KingSale (and its affiliates, related bodies corporate,
          directors, employees, and agents) disclaims all liability to any person relying on the information contained on this website in respect of any loss or damage
          (including consequential loss or damage) however caused, which may be suffered or arise directly or indirectly in respect of such information.
        </p>

        <p className='small'>
          Any forward-looking statements (including projections) contained in the information on this website,
          including in any document or communication posted on this website, are estimates only.
          Such projections are subject to market influences and contingent upon matters outside the control of KingSale and therefore
          may not be realized in the future. Historical returns and past performance are not a reliable indication or a guarantee of future performance and
          KingSale provides no such guarantee. Performance figures referenced on this website may be gross returns calculated before allowing for management
          fees but after consideration of transactions and other costs.
        </p>

        <p className='small'>
          The content of this website is for information purposes only and does not constitute (and should not be considered)
          investment or financial product advice. Further, nothing contained on this website constitutes an offer or recommendation in respect of any financial
          or investment management product or service.  This website has been prepared without taking account of any person’s objectives,
          financial situation or needs and is not intended to be used as the basis for making an investment decision.
          Persons should, before making any investment decision or acting on the information on this website,
          consider the appropriateness of the information and seek their own professional financial advice, having regard to their objectives,
          financial situation, and needs.
        </p>
      </Modal>
    </>
  )
}

export default FooterComponent