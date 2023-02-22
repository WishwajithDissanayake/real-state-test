/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { getWhitelistedAddresses } from "../Blockchain/services/presale.service"

export const useWhitelistedAddresses = (props) => {

  const { poolAddress, refreshWhitelist, setRefreshWhitelist } = props
  const [whitelistedAdd, setWhitelistedAdd] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (poolAddress) {
      fetchWhiteListedAddresses(poolAddress)
    }
  }, [poolAddress])

  useEffect(() => {
    if (poolAddress && refreshWhitelist) {
        setRefreshWhitelist(false)
        fetchWhiteListedAddresses(poolAddress)
    }
  }, [poolAddress, refreshWhitelist])

  const fetchWhiteListedAddresses = async (poolAddress) => {
    try {
      setIsLoading(true)
      const response = await getWhitelistedAddresses(poolAddress)
      setWhitelistedAdd(response)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("ERROR HOOK : while fetching whitelistedAddresses ", error)
    }
  }


  return { whitelistedAdd, isLoading }
}


export default useWhitelistedAddresses