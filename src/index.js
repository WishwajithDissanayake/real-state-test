import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Store } from './Redux/Store'
import { Provider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import Web3LoginProvider from './Providers/Web3LoginProvider'
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import './i18n/config';
import { SocketProvider } from './Providers/SocketProvider'

const getLibrary = (provider) => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const themeState = localStorage.getItem('kingsale-theme')
  ? localStorage.getItem('kingsale-theme') : "dark"

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3LoginProvider>
          <Provider store={Store}>
            <ThemeSwitcherProvider themeMap={themes} defaultTheme={themeState}>
              <App />
            </ThemeSwitcherProvider>
          </Provider>
        </Web3LoginProvider>
      </Web3ReactProvider>
    </SocketProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
