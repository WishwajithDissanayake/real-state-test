import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../Blockchain/connectors/metaMask'
import { wcConnector } from '../Blockchain/connectors/walletConnect'

function Web3LoginProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)


  useEffect(() => {

    const userData = window.localStorage.getItem('userData')
    if (userData) {
      const userDataObj = JSON.parse(userData)
      if (userDataObj.provider === 'injected' && userDataObj.isLoggedIn) {
        injected
          .isAuthorized()
          .then((isAuthorized) => {
            setLoaded(true)
            if (isAuthorized && !networkActive && !networkError) {
              activateNetwork(injected)
            }
          })
          .catch(() => {
            setLoaded(true)
          })
      }

      if (userDataObj.provider === 'walletconnect' && userDataObj.isLoggedIn) {
        const walletConnectData = window.localStorage.getItem('walletconnect')
        if (!networkActive && !networkError && walletConnectData) {
          activateNetwork(wcConnector)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activateNetwork, networkActive, networkError])
  if (loaded) {
    return children
  }
  return children
}

export default Web3LoginProvider