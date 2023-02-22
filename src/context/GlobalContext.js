import { createContext, useEffect, useState, useContext } from "react"
import { configs } from '../Blockchain/web3.config'
import { getChainNetworkByChainId } from '../Blockchain/utils/chainList'
import { ethers } from 'ethers'

const GlobalContext = createContext()
export const GlobalContextProvider = ({ children }) => {

  const [web3SocketProvider, setWeb3SocketProvider] = useState(null)

  useEffect(() => {
    const defaultChainId = configs.chainId
    const web3configs = getChainNetworkByChainId(defaultChainId)
    const provider = new ethers.providers.WebSocketProvider(process.env.REACT_APP_RPC_WEB_SOCKET_URL, {
      name: web3configs.chainName, chainId: parseInt(web3configs.chainId, 16)
    })
    if (provider) {
      setWeb3SocketProvider(provider)
    }
  }, [])

  return (
    <GlobalContext.Provider value={{ web3SocketProvider }}>
      {children}
    </GlobalContext.Provider>
  )

}
export const useGlobalContext = () => useContext(GlobalContext)