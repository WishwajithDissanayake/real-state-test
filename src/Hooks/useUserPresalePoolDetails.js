/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { getUserContributionDetails } from "../Blockchain/services/presale.service"

export const useUserPresalePoolDetails = (props) => {

  const { poolAddress, walletAddress, liquidityTokenName, forcedRefresh } = props
  const [userPresalePoolDetails, setUserPresalePoolDetails] = useState(0.00)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (walletAddress && poolAddress) {
      fetchUserContributionDetails()
    }

  }, [poolAddress, walletAddress, liquidityTokenName])

  useEffect(() => {
    if (forcedRefresh) {
      fetchUserContributionDetails()
    }

  }, [forcedRefresh])

  const fetchUserContributionDetails = async () => {
    try {
      setLoading(true)
      const userPrivateSaleDetailsResponse = await getUserContributionDetails(poolAddress, walletAddress, liquidityTokenName)
      setUserPresalePoolDetails(userPrivateSaleDetailsResponse)
      setLoading(false)
    } catch (error) {
      console.error("ERROR HOOK : while fetching user contribution details ", error)
      setLoading(false)
    }
  }


  return { userPresalePoolDetails, isLoading }
}


export default useUserPresalePoolDetails

