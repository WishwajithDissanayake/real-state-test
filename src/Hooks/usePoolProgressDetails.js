/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useSocket } from "../Providers/SocketProvider"

export const usePoolProgressDetails = (props) => {

  const { poolAddress } = props
  const [poolProgressDetails, setPoolProgressDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    if (socket && poolAddress) {
      fetchPoolProgressDetailsFromSocket()
    }

    return () => {
      if (socket) {
        socket?.off('connect')
        socket?.off('disconnect')
        socket?.off('presaleProgressStatus')
      }
    }

  }, [socket, poolAddress])


  useEffect(() => {
    const interval = setInterval(() => {
      if (poolAddress && socket) {
        fetchPoolProgressDetailsDoInBackground(poolAddress)
      }
      //update every 20 seconds 
    }, 1000 * 20)
    return () => clearInterval(interval)
  }, [poolAddress, socket])


  const fetchPoolProgressDetailsFromSocket = async () => {
    socket?.emit('presaleProgressStatus', { presaleAddress: poolAddress })
    socket?.on('presaleProgressStatus', (data) => {
      if (data?.presaleAddress === poolAddress) {
        setPoolProgressDetails(data?.progressDetails)
      }
    })
  }

  const fetchPoolProgressDetailsDoInBackground = async (poolAddress) => {
    socket?.emit('presaleProgressStatus', { presaleAddress: poolAddress })
    socket?.on('presaleProgressStatus', (data) => {
      if (data?.presaleAddress === poolAddress) {
        setPoolProgressDetails(data?.progressDetails)
      }
    })
  }


  return { poolProgressDetails, isLoading }
}


export default usePoolProgressDetails

