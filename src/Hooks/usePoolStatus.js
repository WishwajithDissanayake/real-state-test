/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useSocket } from '../Providers/SocketProvider'

export const usePoolStatus = (props) => {

  const { poolAddress, forcedRefresh } = props
  const [poolStatus, setPoolStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    if (socket && poolAddress) {
      fetchPoolStatusFromSocket()
    }

    return () => {
      if (socket) {
        socket?.off('connect')
        socket?.off('disconnect')
        socket?.off('presaleStatus')
      }
    }

  }, [socket, poolAddress])

  useEffect(() => {
    if (poolAddress && forcedRefresh) {
      fetchPoolStatusFromSocket()
    }
  }, [poolAddress, forcedRefresh])



  useEffect(() => {

    const interval = setInterval(() => {
      if (poolAddress && socket) {
        updatePoolStatusInBackground()
      }

      //update every 10 seconds 
    }, 1000 * 10)
    return () => clearInterval(interval)
  }, [poolAddress, socket])


  const updatePoolStatusInBackground = async () => {
    socket?.emit('presaleStatus', { presaleAddress: poolAddress })
    socket?.on('presaleStatus', (data) => {
      if (data?.presaleAddress === poolAddress) {
        setPoolStatus(data?.status)
        setIsLoading(false)
      }
    })
  }

  const fetchPoolStatusFromSocket = () => {
    setIsLoading(true)
    socket?.emit('presaleStatus', { presaleAddress: poolAddress })
    socket?.on('presaleStatus', (data) => {
      if (data?.presaleAddress === poolAddress) {
        setPoolStatus(data?.status)
        setIsLoading(false)
      }
    })
  }

  return { poolStatus, isLoading }
}


export default usePoolStatus