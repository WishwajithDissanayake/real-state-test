import React from 'react'
import { Routes, Route } from 'react-router-dom'

// pages
import Dashboard from './Dashboard/Dashboard'
import TokenLocker from './LPAndTokenLocker/TokenLocker'
import LiquidityLocker from './LPAndTokenLocker/LPLocker'
import TokenLockList from './LPAndTokenLocker/TokenLockList'
import LPLockList from './LPAndTokenLocker/LPLockList'
import TokenLockDetails from '../components/LPAndTokenLocker/TokenLocker/TokenLockDetails/TokenLockDetails'
import LPLockDetails from '../components/LPAndTokenLocker/LPLocker/LPLockDetails/LPLockDetails'
import TokenLockRecordDetails from '../components/LPAndTokenLocker/TokenLocker/TokenLockRecordDetails/TokenLockRecordDetails'
import LPLockRecordDetails from '../components/LPAndTokenLocker/LPLocker/LPLockRecordDetails/LPLockRecordDetails'
import CreatePresale from './Launchpad/CreatePresale'
import TokenLockRecordUpdate from '../components/LPAndTokenLocker/TokenLocker/TokenLockRecordDetails/TokenLockRecordUpdate'
import LPLockRecordUpdate from '../components/LPAndTokenLocker/LPLocker/LPLockRecordDetails/LPLockRecordUpdate'
import MyPresales from './Presales/MyPresales'
import LivePresales from './Presales/LivePresales'
import ClosedPresales from './Presales/ClosedPresales'
import UpComingPresales from './Presales/UpComingPresales'
import PresaleDetails from './PresaleDetails/PresaleDetails'
import PresalesMainTabView from './Presales/PresalesMainTabView'
import Pools from './Staking/Pools'
import CreateStakingPool from './Staking/CreateStakingPool'
import Partnership from './Partnership/Partnership'

function Pages() {
  return (
    <Routes>
      <Route path="/" exact element={<Dashboard />} />
      <Route path="/token-locker" exact element={<TokenLocker />} />
      <Route path="/liquidity-locker" exact element={<LiquidityLocker />} />
      <Route path="/token-list" exact element={<TokenLockList />} />
      <Route path="/token-list/view/:id" exact element={<TokenLockDetails />} />
      <Route path="/token-lock/record/:id" exact element={<TokenLockRecordDetails />} />
      <Route path="/token-lock/record/update/:id" exact element={<TokenLockRecordUpdate />} />
      <Route path="/liquidity-list" exact element={<LPLockList />} />
      <Route path="/liquidity-list/view/:id" exact element={<LPLockDetails />} />
      <Route path="/liquidity-lock/record/:id" exact element={<LPLockRecordDetails />} />
      <Route path="/liquidity-lock/record/update/:id" exact element={<LPLockRecordUpdate />} />
      <Route path="/create-presale" exact element={<CreatePresale />} />
      <Route path="/presale-portal" exact element={<PresalesMainTabView/>} />
      <Route path="/my-presales" exact element={<MyPresales />} />
      <Route path="/live-presales" exact element={<LivePresales />} />
      <Route path="/closed-presales" exact element={<ClosedPresales />} />
      <Route path="/upcoming-presales" exact element={<UpComingPresales />} />
      <Route path="/presale-details/:poolAddress" exact element={<PresaleDetails />} />
      <Route path="/pool-portal" exact element={<Pools />} />
      <Route path="/create-stakingpool" exact element={<CreateStakingPool />} />
      <Route path="/partnership" exact element={<Partnership />} />
    </Routes>
  )
}

export default Pages