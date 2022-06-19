import {useContext, useEffect, useState} from 'react'
import { ethers } from "ethers";
import {Web3Context, Web3ContextValue} from "../../context/web3-context";

function Connect() {
  const { account, connect, updateContext } = useContext(Web3Context)



  return (
    <div>
      {
        !!account ? <div>
          {account}
        </div> : (<div onClick={connect}>connect</div>)
      }
    </div>
  )
}

export default Connect
