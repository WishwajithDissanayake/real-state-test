import { Card } from 'antd'
import React from 'react'
import usePoolStatus from '../../Hooks/usePoolStatus'
import FinalizedPoolButton from './AdminZone/FinalizedPoolButton'
import PoolCancelButton from './AdminZone/PoolCancelButton'
import WhiteListingAddressWidget from './AdminZone/WhiteListingAddressWidget'
import { useTranslation } from 'react-i18next';


function AdminControlWidget(props) {

  const { t } = useTranslation();
  const { presaleAddress, presaleSaleDetails, shouldForcedRefresh, setRefreshWhitelist } = props

  const {
    isLoading: isPoolStatusLoading,
    poolStatus
  } = usePoolStatus({ poolAddress: presaleAddress, forcedRefresh: shouldForcedRefresh })
  // const { account, library } = useWeb3React()

  // const [isRewardsTokenSetLoading, setIsRewardsTokenSetLoading] = useState(false)
  // const [isRewardsTokenSet, setIsRewardsTokenSet] = useState(false)
  // const [rewardsTokenValue, setRewardsTokenValue] = useState('')
  // const [isRewardsTokenSetExecutionLoading, setIsRewardsTokenSetExecutionLoading] = useState(false)

  // const key = 'updatable';

  // useEffect(() => {
  //   if (presaleAddress) {
  //     fetchRewardTokenStatus()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [presaleAddress])


  // const handleRewardsTokenSetup = async () => {
  //   try {

  //     if (!account) {
  //       notification['error']({
  //         key,
  //         message: t('Authentication Error'),
  //         description:
  //           t('Please connect your wallet to proceed'),
  //       });
  //       setIsRewardsTokenSetExecutionLoading(false)
  //       return
  //     }

  //     if (!rewardsTokenValue) {
  //       notification['error']({
  //         key,
  //         message: t('Input Error'),
  //         description:
  //           t('Please enter a correct address for rewards token'),
  //       });
  //       setIsRewardsTokenSetExecutionLoading(false)
  //       return
  //     }

  //     setIsRewardsTokenSetExecutionLoading(true)
  //     const response = await setRewardsToken(presaleAddress, rewardsTokenValue, library.getSigner())
  //     console.log("response ", response)
  //     setIsRewardsTokenSetExecutionLoading(false)
  //     notification['success']({
  //       key,
  //       message: t('Success'),
  //       description: t('Rewards token address has been added to the pool.'),
  //     });
  //   } catch (error) {
  //     console.error("ERROR while adding the rewards token address ", error)
  //     setIsRewardsTokenSetExecutionLoading(false)
  //     notification['error']({
  //       key,
  //       message: t('Transaction Execution Failed'),
  //       description: error,
  //     });

  //   }
  // }


  // const fetchRewardTokenStatus = async () => {
  //   try {
  //     setIsRewardsTokenSetLoading(false)
  //     const rewardsTokenSetResponse = await getRewardTokenSetStatus(presaleAddress)
  //     setIsRewardsTokenSet(rewardsTokenSetResponse)
  //     setIsRewardsTokenSetLoading(false)
  //   } catch (error) {
  //     setIsRewardsTokenSet(false)
  //     setIsRewardsTokenSetLoading(false)
  //     console.error("ERROR while fetching reward token set status")
  //   }
  // }

  return (
    <div>
      <Card className="mt-2 kingsale-card-bg">
        <div className='d-flex justify-content-center'>
          {t('Admin Controls (Danger Zone)')}
        </div>

        <div className="mt-4 finalized-pool">
          <FinalizedPoolButton
            isPoolStatusLoading={isPoolStatusLoading}
            presaleSaleDetails={presaleSaleDetails}
            poolStatus={poolStatus}
            presaleAddress={presaleAddress}
          />
        </div>

        <div className="mt-4 finalized-pool">
          <PoolCancelButton
            isPoolStatusLoading={isPoolStatusLoading}
            poolStatus={poolStatus}
            presaleAddress={presaleAddress}
          />
        </div>

        {/* <div className="mt-4">
          <span className='input-label'>
            {t('Set your rewards token')}
          </span>
        </div>
        <div className="" style={{ padding: '5px 0px' }}>
          <Input
            disabled={isRewardsTokenSetLoading || isRewardsTokenSet}
            value={isRewardsTokenSetLoading ? t('Please wait') : rewardsTokenValue}
            onChange={e => setRewardsTokenValue(e.target.value)}
          />
        </div>

        <div className='contribution-button-container'>
          <Button
            loading={isRewardsTokenSetExecutionLoading}
            onClick={handleRewardsTokenSetup}
            disabled={isRewardsTokenSetLoading || isRewardsTokenSet || !rewardsTokenValue}
            type="primary">
            {t('Set Rewards Token')}
          </Button>
        </div> */}

        <div className="mt-4 finalized-pool">
          <WhiteListingAddressWidget
            setRefreshWhitelist={setRefreshWhitelist}
            presaleAddress={presaleAddress}
          />
        </div>

      </Card>
    </div>
  )
}

export default AdminControlWidget