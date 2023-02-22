import { Alert, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { getAddressWhiteListedStatus } from '../../Blockchain/services/presale.service'
import { useWeb3React } from '@web3-react/core'
import { DateTime } from 'luxon'

function UserPresaleWhiteListedAlert(props) {

  const { presaleDetails } = props

  const { account } = useWeb3React()
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(false)
  const [isUserWhitelistingDataLoading, setIsUserWhitelistingDataLoading] = useState(false)

  useEffect(() => {
    if (presaleDetails && account) {
      fetchUserWhitelistingData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presaleDetails, account])

  const fetchUserWhitelistingData = async () => {
    try {
      setIsUserWhitelistingDataLoading(true)
      const response = await getAddressWhiteListedStatus(presaleDetails?.poolContractAddress, account)
      setIsUserWhitelisted(response)
      setIsUserWhitelistingDataLoading(false)
    } catch (error) {
      console.log("ERROR while fetching user whitelisting data ", error)
      setIsUserWhitelisted(false)
    }
  }

  return (
    <div>
      {
        account && presaleDetails?.isWhiteListingEnabled ? (
          <>
            {
              isUserWhitelistingDataLoading ? (
                <div className='d-flex justify-content-center'><Spin /></div>
              ) : (
                parseInt(presaleDetails?.publicSaleStartTimestamp) > parseInt(DateTime.now().toSeconds()) ? (
                  isUserWhitelisted ? (
                    <Alert message="You're Whitelisted ✅" type="info" className='text-center' />
                  ) : (
                    <Alert message="You're not whitelisted ❌" type="info" className='text-center' />
                  )
                ) : (<></>)

              )
            }
          </>
        ) : (<></>)
      }

    </div>
  )
}

export default UserPresaleWhiteListedAlert