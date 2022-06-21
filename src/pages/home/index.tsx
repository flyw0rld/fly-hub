import Button from "../../components/button";
import Fly from "../../components/audio";
import {useContext, useEffect, useState} from "react";
import {Web3Context} from "../../context/web3-context";
import "./index.css";
import useAllowlist from "./useAllowlist";

function Home() {
  const { account, chainId, nft, connect, provider} = useContext(Web3Context)
  const {isAllowlist, proof} = useAllowlist();
  const [loading , setLoading] = useState<boolean>()
  const [genesisSupply , setGenesisSupply] = useState<number>()
  const [totalSupply , setTotalSupply] = useState<number>()
  const [status , setStatus] = useState<number>()
  const [minted , setMinted] = useState<boolean | null>(null)
  const [claimStatus , setClaim] = useState<string | null>(null)

  const load = async (address?: string | null) => {
    setLoading(true)
    console.log('load');
    try {
      const genesis = (await nft.genesisSupply()).toNumber();
      const stage = await nft.status();
      setStatus(stage)
      setTotalSupply(Math.min((await nft.totalSupply()).toNumber(), genesis))
      setGenesisSupply(genesis)
      if(account){
        const toNumber = (await nft.numberMinted(address)).toNumber();
        setMinted(toNumber >= 1)
        console.log(stage);
      }
    }catch (e){
      console.log(e);
    }
    setLoading(false)
  }

  useEffect(() => {
    load(account)
  },[account, chainId])

  const handleClick = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.mint()
      setClaim('loading')
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load()
    }else {
      connect()
    }
  }

  const handleAllowlistMint = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.whitelistMint(proof, 1)
      setClaim('loading')
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load()
    }else {
      connect()
    }
  }

  return (
    <div className="home_container">
      <div className="home">
        <div className="home-desc">It is a world buried by corpses, where all living beings cannot escape their destiny of death. The zombie army is back for the zombie feast. It has just begun.</div>
        {loading && <div className="loading">loading...</div>}
        {
          (!loading && !!genesisSupply) && <>
            {
              genesisSupply && <div className="home-amount">{totalSupply} / {genesisSupply}</div>
            }
            <Fly shake={!minted} className="home-fly">
              {
                !account && <Button className="home-button" size="L" onClick={connect}>
                  CONNECT
                </Button>
              }
              {
                account && <>
                  {(status == 0 || status == 4) && <Button className="home-button" size="L" disabled={!!minted}>
                    NOT STARTED
                  </Button>}
                  {status == 1 && isAllowlist && <Button className="home-button" size="L" onClick={handleAllowlistMint} disabled={!!minted}>{
                    claimStatus === 'loading' ? 'minting...' : minted ? 'MINTED' : 'WHITELIST MINT'
                  }</Button>}
                  {status == 1 && !isAllowlist && <Button className="home-button" size="L" disabled={true}>
                    NOT WHITELISTED
                  </Button>}
                  {
                    status == 2 && <Button className="home-button" size="L" onClick={handleClick} disabled={!!minted}>{
                      claimStatus === 'loading' ? 'minting...' : minted ? 'MINTED' : 'PUBLIC MINT'
                    }</Button>
                  }
                </>
              }
            </Fly>
          </>
        }
        {claimStatus === 'success' && <div className="tips tips-success">
          MINT SUCCESS
        </div>}
        {claimStatus === 'fail' && <div className="tips tips-fail">
          MINT FAIL
        </div>}
      </div>
    </div>
  )
}

export default Home
