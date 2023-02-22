import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  AppstoreFilled,
  RocketFilled,
  LockFilled,
  DatabaseFilled,
  UsergroupAddOutlined,
  RobotFilled,
  BankOutlined,
  InfoCircleFilled,
  SendOutlined,
  TwitterOutlined,
  DollarCircleOutlined,
  StarOutlined
} from '@ant-design/icons'
import './MenuComponent.css'
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

function MenuComponent(props) {

  const { setShowMobileMenu } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation();
  const { margin } = useSelector((state) => state.margin);
  const [hideChildren, setHideChildren] = useState(false)

  const [openKeys, setOpenKeys] = useState([location.pathname]);

  useEffect(() => {
    if (!margin) {
      setHideChildren(true)

      setTimeout(function () {
        setHideChildren(false)
      }, 500)
    } else {
      setHideChildren(false)
    }
  }, [margin])

  // menu item structure
  const getItem = (label, key, icon, children, theme) => {
    return {
      key,
      icon,
      children,
      label,
      theme,
    };
  }

  // const rootSubmenuKeys = ['/', '/launchpad', '/kings-locker', '/kingstaking', '/partnership', 'bot', 'kyc', 'info', 'funding', 'telegram', 'twitter' ];
  const rootSubmenuKeys = ['/launchpad', '/kings-locker', '/kingstaking'];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  // menu items
  const items = [
    getItem(t('Home'), '/', <AppstoreFilled />),
    getItem(t('Create Presale'), '/create-presale', <RocketFilled />),
    getItem(t('Presale Portal'), '/presale-portal', <StarOutlined />),
    // getItem(t('Launchpad'), '/launchpad', <RocketFilled />, [
    //   getItem(t('Create Presale'), '/create-presale'),
    //   getItem(t('Presale Portal'), '/presale-portal'),
    // getItem(t('My Presales'), '/my-presales'),
    // getItem(t('Live Presales'), '/live-presales'),
    // getItem(t('Closed Presales'), '/closed-presales'),
    // getItem(t('Upcoming Sales'), '/upcoming-presales'),
    // ]),
    // getItem(t('King Locker'), '/kings-locker', <LockFilled />, [
    //   getItem(t('Create Token Locker'), '/token-locker'),
    //   getItem(t('Create LP Locker'), '/liquidity-locker'),
    //   getItem(t('Token Lock List'), '/token-list'),
    //   getItem(t('Liquidity Lock List'), '/liquidity-list'),
    // ]),
    getItem(t('King Staking'), '/kingstaking', <DatabaseFilled />, [
      getItem(t('Creating Staking Pool'), '/create-stakingpool'),
      getItem(t('Pool Portal'), '/pool-portal'),
      getItem('Closed Pools', '/closed-pools')
    ]),
    // getItem(t('Partnership'), '/partnership', <UsergroupAddOutlined />),
    // getItem(t('Stake Tracking Bot'), 'bot', <RobotFilled />),
    // getItem(t('KYC'), 'kyc', <BankOutlined />),
    // getItem(t('Info'), 'info', <InfoCircleFilled />),
    // getItem(t('Project Funding'), 'funding', <DollarCircleOutlined />),
    // getItem(t('Telegram'), 'telegram', <SendOutlined style={{ transform: 'rotate(320deg)', marginTop: '-3px' }} />),
    // getItem(t('Twitter'), 'twitter', <TwitterOutlined />),
  ];

  // onclick event on a menu item, navigates ti relevant route
  const onClick = (e) => {
    if (setShowMobileMenu) {
      setShowMobileMenu(false)
    }
    if (e.key === 'funding') {
      window.open(
        'https://kingsfund.io/project-funding/',
        '_blank'
      );
    } else if (e.key === 'twitter') {
      window.open(
        'https://twitter.com/KingSaleFinance',
        '_blank'
      );
    } else if (e.key === 'telegram') {
      window.open(
        'https://t.me/KINGSALEcommunity',
        '_blank'
      );
    }
    else if (e.key === 'kyc') {
      window.open(
        'https://docs.kingsale.finance/additional-features/kyc-and-audit',
        '_blank'
      );
    }
    else if (e.key === 'info') {
      window.open(
        'https://docs.kingsale.finance',
        '_blank'
      );
    }
    else if (e.key === 'bot') {
      window.open(
        'https://docs.kingsale.finance/additional-features/stake-tracking-bot',
        '_blank'
      );
    }
    else {
      navigate(e.key);
    }
  };


  return (
    <>
      {/* menu section */}
      <Menu
        openKeys={hideChildren ? null : openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        selectedKeys={location.pathname}
        theme="light"
        onClick={onClick}
        style={{ padding: '1px' }}
        items={items}
        className="menu-background"
      />
    </>
  )
}

export default MenuComponent
