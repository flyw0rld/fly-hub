import {Web3Context, Web3ContextProvider} from './context/web3-context'
import './App.css'
import './index.css'
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  NavLink
} from "react-router-dom";
import Home from "./pages/home";
import Nest from "./pages/nest";
import Button from "./components/button";
import {useContext} from "react";
import Fly from "./components/audio";
import { truncateAddress } from "./utils";

function App() {
  const {account, chainId, connect, switchNetwork} = useContext(Web3Context)
  const correct = chainId === 4
  return (
    <div>
      <header>
        <div className='logo' />
        <div className="header-actions">
          <NavLink className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item inactive')} to="/">HOME</NavLink>
          {/*<NavLink className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item inactive')} to="/nest">NEST</NavLink>*/}
          <Fly className="connect-button" shake={false}>
            {
              (correct || !account) && <Button size="S" onClick={account ? () => {} : connect} >
                {account ? truncateAddress(account) : 'CONNECT'}
              </Button>
            }

            {
              !correct && chainId && <Button size="S" onClick={switchNetwork} danger >
                SWITCH NETWORK
              </Button>
            }
          </Fly>
        </div>
      </header>
      <Outlet/>
    </div>
  )
}

export function Main() {
  return (
    <Web3ContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />}/>
            {/*<Route path="nest" element={<Nest />}/>*/}
          </Route>
        </Routes>
      </HashRouter>
    </Web3ContextProvider>
  )
}

export default App
