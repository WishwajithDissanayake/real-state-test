import { InjectedConnector } from '@web3-react/injected-connector'
const selectedNetWorks = [56, 97, 137, 43114, 2, 3, 4, 42, 1]
const injected = new InjectedConnector({ supportedChainIds: selectedNetWorks })

export { selectedNetWorks, injected }