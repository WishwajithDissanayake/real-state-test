import { Alert, Modal } from 'antd'
import React, {useState} from 'react'

export default function StakingDisclaimer() {

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

  const disclaimerMessage = `Twin token staking pool compounding calculations require users to sell rewarded token to repurchase staked token and stake those tokens to acquire compound affect. 
  Please note that the KingSale staking pool calculator is not 100% accurate, and USD or % Values can be manipulated by on chain liquidity and contract manipulation.  
  KingSale is a decentralized platform, anyone can make a scam staking pool to steal your tokens, 
  please DYOR before investing and take none of the shown pools as financial advice.`;
  return (
    <div className='mt-3'>
      <span className='primary-text presale-advanced-name' style={{cursor: 'pointer'}} onClick={() => showModal()}
      >
        <Alert
          message="Disclaimer"
          // description={disclaimerMessage}
          type="warning"
          showIcon
        />
      </span>
      <Modal title="Disclaimer" visible={disclaimerModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} width={1000}>
        <p className='small'> 
          {disclaimerMessage}
        </p>
      </Modal>
      
    </div>
  )
}
