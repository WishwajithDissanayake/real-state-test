import React, { createContext, useContext, useEffect, useState } from "react"
import socketio from "socket.io-client"

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketConnection = socketio.connect(process.env.REACT_APP_SOCKET_BASE_URL)
    setSocket(socketConnection)
    return () => {
      socketConnection.close()
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}