import { ethers } from 'ethers'
import React from 'react'


const EXPECTED_PONG_BACK = 15000
const KEEP_ALIVE_CHECK_INTERVAL = 7500
export let provider = null
export const startConnection = () => {
  provider = new ethers.providers.WebSocketProvider(process.env.REACT_APP_RPC_WEB_SOCKET_URL)

  let pingTimeout = null
  let keepAliveInterval = null

  provider._websocket.on('open', () => {
    keepAliveInterval = setInterval(() => {

      provider._websocket.ping()

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate()
      }, EXPECTED_PONG_BACK)
    }, KEEP_ALIVE_CHECK_INTERVAL)

    // TODO: handle contract listeners setup + indexing
  })

  provider._websocket.on('close', () => {
    clearInterval(keepAliveInterval)
    clearTimeout(pingTimeout)
    startConnection()
  })

  provider._websocket.on('pong', () => {
    clearInterval(pingTimeout)
  })
}


startConnection()


export const Web3SocketContext = React.createContext()

