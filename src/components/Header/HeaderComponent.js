import React, { useState, useEffect } from 'react'
import './HeaderComponent.css'
import { Link } from 'react-router-dom'
import { Row } from 'reactstrap'
import { Button, Drawer, Modal } from 'antd'
import MenuComponent from '../Menu/MenuComponent'
import Metamask from '../../images/MetaMask_Fox.png'
import WalletConnect from '../../images/walletconnect.png'
import { Copy, CheckCircle, ExternalLink } from 'react-feather'
import { getEllipsisTxt } from '../../helpers/Formatters'
import Logo from '../../images/kingsfund.png'
import BSCLogo from '../../images/blockchains/binance.png'
import { configs } from '../../Blockchain/web3.config'
import { getChainNetworkByChainId } from '../../Blockchain/utils/chainList'
import { injected } from '../../Blockchain/connectors/metaMask'
import { wcConnector } from '../../Blockchain/connectors/walletConnect'
import { useWeb3React } from '@web3-react/core'
import { MenuOutlined, DoubleLeftOutlined, WalletFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from "react-redux";
import { change } from '../../Redux/SidemenuMargin';
import { open, close } from '../../Redux/WalletConnect'
// import MainLogo from '../../images/logo_v2.png'
import WebsiteSettings from '../WebsiteSettings/WebsiteSettings'
import { open_blockchain_modal } from '../../Redux/BlockChainChange'
import ChangeBlockChain from './ChangeBlockChain'
import { useTranslation } from 'react-i18next';

function Header() {

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { margin } = useSelector((state) => state.margin)
  const { modal_opened } = useSelector((state) => state.connectModalState)
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [hamburgerClass, setHamburgerClass] = useState('hamburger')


  const web3React = useWeb3React()
  const { account, deactivate } = web3React

  const [isDisconnectVisible, setIsDisconnectVisible] = useState(false)
  const [currentNetworkID, setCurrentNetworkID] = useState(0)
  const [networkName, setNetworkName] = useState('Unknown Network')
  const [addressCopy, setAddressCopy] = useState(false)


  useEffect(() => {
    console.info("Network change ", networkName)
  }, [networkName])


  //check current network if metamask installed and perform the switch network task
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', event => {
        const chainID = parseInt(event.toString(), 16)
        setCurrentNetworkID(chainID)
      });

      window.ethereum.request({ method: "eth_chainId" })
        .then(chainId => {
          setCurrentNetworkID(parseInt(chainId, 16))
        })

    }

  }, [])

  useEffect(() => {
    const network = getChainNetworkByChainId(currentNetworkID)
    console.log('currentNetworkID', currentNetworkID)
    setNetworkName(network ? network.chainName : 'Unknown Network')
    if (currentNetworkID !== 0) {
      const defaultChainId = configs.chainId
      if (defaultChainId !== currentNetworkID && account) {
        //changeNetwork(defaultChainId)
      }
    } else {
      setNetworkName('Unknown Network')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNetworkID, account])


  const changeNetwork = async (chainID) => {
    const result = getChainNetworkByChainId(chainID)
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...result
          }
        ]
      });
    } catch (err) {

    }
  };

  const handleMetamaskConnect = async () => {
    try {
      await web3React.activate(injected)
      const loginPayload = {
        provider: 'injected',
        isLoggedIn: true
      }
      window.localStorage.setItem('userData', JSON.stringify(loginPayload))
    } catch (error) {

      const loginPayload = {
        provider: 'injected',
        isLoggedIn: false
      }
      window.localStorage.setItem('userData', JSON.stringify(loginPayload))
    } finally {
      dispatch(close())
    }
  }

  const handleWalletConnectConnect = async () => {
    try {
      await web3React.activate(wcConnector)
      const loginPayload = {
        provider: 'walletconnect',
        isLoggedIn: true
      }
      window.localStorage.setItem('userData', JSON.stringify(loginPayload))
    } catch (error) {
      const loginPayload = {
        provider: 'walletconnect',
        isLoggedIn: false
      }
      window.localStorage.setItem('userData', JSON.stringify(loginPayload))
      console.error('error connecting to wallet-connect ', error)
    } finally {
      dispatch(close())
    }
  }

  const handleDisconnect = () => {
    try {
      window.localStorage.removeItem("userData")
      deactivate()
      handleCancel()
    } catch (error) {
      console.error("error while logout from user ", error)
    }
  }

  const handleOk = () => {
    console.log('handleOk')
  };

  const handleCancel = () => {
    setIsDisconnectVisible(false)
  };

  const showDrawer = () => {
    setShowMobileMenu(true);
  };

  const closeDrawer = () => {
    setShowMobileMenu(false);
  };

  const showDisconnectModal = () => {
    setIsDisconnectVisible(true)
  }


  const copyAddress = () => {
    setAddressCopy(true)
    navigator.clipboard.writeText(account)
  }

  const handleSideMenu = () => {
    if (hamburgerClass === "hamburger") {
      setHamburgerClass("hamburger is-active")
    } else {
      setHamburgerClass("hamburger")
    }
    dispatch(change())
  }

  return (
    <div className="fixed-top bg-blue">
      <Row>
        <div className='d-flex justify-content-between'>
          <div>

            <div className='d-flex'>
              <MenuOutlined style={{ fontSize: '18px', marginRight: '5px' }} className='mobile-menu my-auto' onClick={showDrawer} />

              <div className="hamburger-menu-margin three hamburger-col hide-on-mobile my-auto">
                <div className={hamburgerClass} id="hamburger-10" onClick={() => handleSideMenu()}>
                  <span className="line"></span>
                  <span className="line"></span>
                  <span className="line"></span>
                </div>
              </div>

              <div>
                {/* <Link to="/"><img src={MainLogo} alt="kingsale_main_logo" className='noselect kingsale_main_logo' /></Link> */}
              </div>
            </div>
          </div>

          <div className='my-auto d-flex'>

            <Button
              className='kingsale-primary-button fw-bold'
              style={{ marginRight: '5px' }}
              onClick={() => dispatch(open_blockchain_modal())}>
              <div className='d-flex'>
                <div style={{ marginTop: '-2px' }}><img src={BSCLogo} alt="bsc-logo" style={{ width: '25px' }} /></div> <span className='hide-on-mobile' style={{ marginLeft: '3px' }}>{networkName}</span>
              </div>
            </Button>

            {
              account ?
                <>
                  <Button className='kingsale-primary-button hide-on-mobile fw-bold' onClick={() => showDisconnectModal(true)}><div className='d-flex'>{getEllipsisTxt(account, 5)} <div style={{ marginTop: '-3px', marginLeft: '2px' }}><WalletFilled /></div></div></Button>
                  <Button className='kingsale-primary-button hide-on-pc fw-bold' onClick={() => showDisconnectModal(true)}><div style={{ marginTop: '-2px' }}><WalletFilled style={{ fontSize: '22px' }} /></div></Button>
                </>
                :
                <>
                  <Button className='kingsale-primary-button fw-bold hide-on-mobile' onClick={() => dispatch(open())}>{t('Connect')}</Button>
                  <Button className='kingsale-primary-button fw-bold hide-on-pc' onClick={() => dispatch(open())}><div className='small'>{t('Connect')}</div></Button>
                </>
            }
          </div>
        </div>
      </Row>

      <Drawer
        placement="left"
        onClose={closeDrawer}
        visible={showMobileMenu}
        closable={false}
        width="250px"
        style={{ zIndex: '9999' }}
      >
        <div style={{ marginLeft: '-8px' }}>

          <div className='pb-1' style={{ marginTop: '-17px' }}>
            <DoubleLeftOutlined style={{ fontSize: '18px', marginRight: '5px' }} className='mobile-menu-svg' onClick={closeDrawer} />

            {/* <img src={MainLogo} alt="kingsale_main_logo" className='kingsale_main_logo' style={{ marginLeft: '' }} /> */}
          </div>

          <MenuComponent
            setShowMobileMenu={setShowMobileMenu}
          />

          <div>
            <WebsiteSettings />
          </div>
        </div>
      </Drawer>

      {/* Wallet connect modal will show up when wallet connect button clicked */}
      <Modal title={t('Connect Wallet')} visible={modal_opened} onOk={() => dispatch(close())} onCancel={() => dispatch(close())} footer={false}>
        <Button
          className='col-12 kingsale-primary-button'
          size="large"
          onClick={handleMetamaskConnect}>
          <img src={Metamask} alt="metamask_logo" style={{ width: '30px', marginRight: '10px' }} />
          {t('Connect with Metamask')}
        </Button>

        <Button
          className='col-12 kingsale-primary-button mt-3'
          size="large"
          onClick={handleWalletConnectConnect}>
          <img src={WalletConnect} alt="wallet connect logo" style={{ width: '25px', marginRight: '10px' }} />
          {t('Connect with WalletConnect')}
        </Button>
      </Modal>

      <Modal title={t('Connected Wallet')} visible={isDisconnectVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>

        <div className="row">
          <p className="text-muted fw-bold col-lg-8 col-sm-12 hide-on-mobile">Connected</p>
          <p className="text-lg-end col-lg-4 col-md-12 col-sm-12 fw-bold cursor" onClick={handleDisconnect}>
            <Button className="btn blue-button col-12 kingsale-primary-button fw-bold" style={{ marginRight: '15px' }} onClick={handleDisconnect}>{t('Disconnect')}</Button>
          </p>
        </div>

        <div className='user-account-address-container'>
          <Button
            className="btn blue-button-bordered hide-on-small-devices d-flex primary-text col-12"
            style={{ marginRight: '15px' }}>
            <img src={Logo} style={{ width: '20px', marginRight: '15px' }} alt='' />
            <span className='small'>{getEllipsisTxt(account, 10)}</span>
          </Button>
        </div>

        <div className="row mt-3">
          {
            !addressCopy &&
            <p className="fw-bold col-8 hide-on-mobile cursor" onClick={copyAddress} style={{ cursor: "pointer" }}>
              <Copy size={18} color="#e6bd4f" />
              <span style={{ marginLeft: '5px' }} className="primary-text">{t('Copy address')}</span>
            </p>
          }
          {
            addressCopy &&
            <p className="fw-bold col-8 hide-on-mobile">
              <CheckCircle size={18} color="#e6bd4f" />
              <span style={{ marginLeft: '5px' }}>{t('Copied')}</span>
            </p>
          }

          <p className="text-lg-end col-md-4 col-sm-6 fw-bold">
            <a
              href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${account}`}
              target="_blank"
              className="col-lg-4 col-md-6 col-sm-6  fw-bold"
              rel="noreferrer">
              <ExternalLink size={18} color="#e6bd4f" />
              <span
                style={{ marginLeft: '5px', textDecoration: "none", cursor: "pointer" }}>
                {t('View on explorer')}
              </span>
            </a>
          </p>
        </div>

      </Modal>

      {/* modal to change block chain */}
      <ChangeBlockChain />
    </div>
  )
}

export default Header