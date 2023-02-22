import React, { useState, useEffect } from 'react'
import {
  getPoolWhiteListedStatus,
  whitelistUsers
} from '../../../Blockchain/services/presale.service'
import { Spin, Button, notification, Tag } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Row, Col } from 'reactstrap'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next';

export default function WhiteListingAddressWidget(props) {

  const { t } = useTranslation();
  const { presaleAddress, setRefreshWhitelist } = props

  const [isWhitelistStatusCheckLoading, setIsWhitelistStatusCheckLoading] = useState(false)
  const [whiteListStatus, setWhiteListStatus] = useState(false)
  const [whiteListedAddress, setWhiteListedAddress] = useState([])
  const [walletAddressCount, setWalletAddressCount] = useState(0)
  const [metamaskOpenTime, setMetamaskOpenTime] = useState(0)
  const [isMetamaskOpenMoreTime, setIsMetamaskOpenMoreTime] = useState(false)
  const [isWhiteListedExecutionLoading, setIsWhiteListedExecutionLoading] = useState(false)
  const { account, library } = useWeb3React()
  const key = 'updatable';

  useEffect(() => {
    if (presaleAddress) {
      checkPoolWhitelistStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presaleAddress])

  useEffect(() => {

  }, [])

  const checkPoolWhitelistStatus = async () => {
    try {
      setIsWhitelistStatusCheckLoading(true)
      const whitelistStatusResponse = await getPoolWhiteListedStatus(presaleAddress)
      setWhiteListStatus(whitelistStatusResponse)
      setIsWhitelistStatusCheckLoading(false)
    } catch (error) {
      setWhiteListStatus(false)
      setIsWhitelistStatusCheckLoading(false)
      console.error("ERROR while checking pool whitelist status ", error)
    }
  }

  const handleWhitelistedAccountChanges = (value) => {
    let walletAddressFound = []
    const trimmedValue = value.replace(/\s/g, '');
    if (trimmedValue) {
      walletAddressFound = trimmedValue.split(",")
      console.log('walletAddressFound: ', walletAddressFound)
      setWalletAddressCount(walletAddressFound.length || 0)
      
      if (walletAddressFound && walletAddressFound.length > 0) {

        const chunkSize = 15;
        // const chunkSize = 2;
        if (walletAddressFound.length > chunkSize) {
          setIsMetamaskOpenMoreTime(true)
          
          let timesHaveToOpenMetamask = Math.floor(walletAddressFound.length/chunkSize); 
          const remainder = Math.floor(walletAddressFound.length%chunkSize);
          
          if (remainder>0) {
            timesHaveToOpenMetamask = timesHaveToOpenMetamask + 1
            setMetamaskOpenTime(timesHaveToOpenMetamask)
          } else {
            setMetamaskOpenTime(timesHaveToOpenMetamask)
          }
        }

        for(let i = 0; i < walletAddressFound.length; i++) {
          setWhiteListedAddress(oldArray => [...oldArray, walletAddressFound[i]]);
        }
        setWhiteListedAddress(walletAddressFound)
      } else {
        setWhiteListedAddress([])
        setWalletAddressCount(0)
      }
    } else {
      setWhiteListedAddress([])
      setWalletAddressCount(0)
    }
  }

  const handleSetWhitelistedWalletAddress = async () => {
    try {
      if (!account) {
        notification['error']({
          key,
          message: t('Authentication Error'),
          description:
            t('Please connect your wallet to proceed'),
        });
        setIsWhiteListedExecutionLoading(false)
        return
      }

      if (walletAddressCount <= 0) {
        notification['error']({
          key,
          message: t('Input Error'),
          description:
            t('No wallet address found please check the provided details'),
        });
        setIsWhiteListedExecutionLoading(false)
        return
      }

      if (walletAddressCount > 2) {
        setIsWhiteListedExecutionLoading(true)
        const chunkSize = 15;
        // const chunkSize = 2;
        let metamaskOpened = 0
        for (let i = 0; i < whiteListedAddress.length; i += chunkSize) {
            const chunk = whiteListedAddress.slice(i, i + chunkSize);

            const whitelistUserResponse = await whitelistUsers(presaleAddress, chunk, library.getSigner())
            if (whitelistUserResponse) {
              metamaskOpened = metamaskOpened + 1
              setMetamaskOpenTime(metamaskOpenTime - 1)
                notification['success']({
                  key,
                  message: t(`Set ${metamaskOpened} Whitelisting Complete`),
                  description:
                    t(`You have successfully whitelisted set ${metamaskOpened} wallet address`),
                });
                
            }
        }
        setIsMetamaskOpenMoreTime(false)
        setIsWhiteListedExecutionLoading(false)
        setWhiteListedAddress('')
        setRefreshWhitelist(true)
        setWalletAddressCount(0)
        return
      }
      setIsWhiteListedExecutionLoading(true)
        const whitelistUserResponse = await whitelistUsers(presaleAddress, whiteListedAddress, library.getSigner())
        if (whitelistUserResponse) {
          notification['success']({
            key,
            message: t(`Whitelisting Complete`),
            description:
              t(`You have successfully whitelisted wallet address`),
          });

          setRefreshWhitelist(true)
          setWhiteListedAddress('')
          setWalletAddressCount(0)
      }
        setIsWhiteListedExecutionLoading(false)

      
    } catch (error) {
      setIsWhiteListedExecutionLoading(false)
      console.error("ERROR while executing token whitelisting ", error)
      notification['error']({
        key,
        message: t('Transaction Execution Error'),
        description: error,
      });

    }
  }

  return (
    <div>

      {
        isWhitelistStatusCheckLoading ? (
          <div className='d-flex justify-content-center'>
            <Spin size='small' />
          </div>
        ) : (
          <>
            {
              whiteListStatus ? (
                <>
                  <Row className="mt-4">
                    <span className='input-label'>
                      {t('Whitelist user wallet address')}
                    </span>
                  </Row>

                  {
                    whiteListedAddress && whiteListedAddress.map((address) => (
                      <Tag className="text-break" color="gold">{address}</Tag>
                    ))
                  }

                  <Row style={{ padding: '0 10px' }} className="mt-1">
                    <TextArea
                      rows={5}
                      onChange={e => handleWhitelistedAccountChanges(e.target.value)}
                      value={whiteListedAddress}
                      placeholder="Enter comma separated Whitelisting Addresses here"
                    />
                  </Row>

                  <Row className="mt-2">
                    <span className='wallet-count-metadata'>{t('We have found')} {walletAddressCount} {t('address')}</span>
                    {
                      isMetamaskOpenMoreTime ? (
                        <span>Metamask will open {metamaskOpenTime} times</span>
                      ) : (<></>)
                    }
                    <div className='contribution-button-container'>
                      <Button
                        loading={isWhiteListedExecutionLoading}
                        onClick={handleSetWhitelistedWalletAddress}
                        disabled={walletAddressCount === 0}
                        type="primary">
                        {t('Set Whitelisted Accounts')}
                      </Button>
                    </div>
                  </Row>
                </>
              ) : (<></>)
            }

          </>
        )
      }
    </div>
  )
}
