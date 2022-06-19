import React, {useEffect, useState, useRef, PropsWithChildren} from 'react';
import { isString } from 'lodash-es';
import {Contract, ethers} from "ethers";
import {JsonRpcProvider} from "@ethersproject/providers/src.ts/json-rpc-provider";
import {toHex} from "../utils";
import {config} from "../config";
import nftABI from "../abis/nft.json";
import stakingABI from "../abis/staking.json";

export interface Web3ContextValue {
  chainId?: number,
  account?: string | null,
  provider: JsonRpcProvider,
  connect: () => void,
  switchNetwork: () => void,
  nft: Contract,
  nest: Contract,
  updateContext?: (key: keyof Web3ContextValue | Partial<Web3ContextValue>, data?: any) => void
}

const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum as any, "any") :  new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');


const switchNetwork = async (chainId?: number) => {
  if(chainId != 1) {
    await provider.send('wallet_switchEthereumChain', [{ chainId: toHex(1) }]);
  }
}

const connect = async () => {
  await provider.send("eth_requestAccounts", []);
}

const nft = new ethers.Contract(config.NFT, nftABI, provider)
const nest = new ethers.Contract(config.NEST, stakingABI, provider)

function getInitialValue() {
  return {
    provider,
    connect,
    switchNetwork,
    nft,
    nest,
  };
}

export const Web3Context = React.createContext<Web3ContextValue>(getInitialValue());


export const Web3ContextProvider = (props: PropsWithChildren) => {

  const rerender = useState<{}>()[1]

  const updateContext = (key: keyof Web3ContextValue | Partial<Web3ContextValue>, data?: any) => {
    context.current = {
      ...context.current,
      ...(isString(key) ? { [key as keyof Web3ContextValue]: data } : key as Partial<Web3ContextValue>)
    }
    rerender({});
  }

  const context = useRef<Web3ContextValue>(Object.assign(getInitialValue(), {
    updateContext,
  }))

  const load= async () => {
    console.log('load');
    try {
      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      const chainId = (await provider.getNetwork())?.chainId;
      const nft = new ethers.Contract(config.NFT, nftABI, signer)
      const nest = new ethers.Contract(config.NEST, stakingABI, signer)
      console.log(account, chainId);
      if(account || chainId) {
        updateContext?.({
          account,
          chainId,
          nft,
          nest
        } as Partial<Web3ContextValue>)
      }
    }catch (e) {
      console.log(e, 'error');
      updateContext?.({
        account: null,
      } as Partial<Web3ContextValue>)
    }
  }

  useEffect(() => {
    load()

    if(window.ethereum) {
      window.ethereum.on('connect', load)

      window.ethereum.on('disconnect', load)

      window.ethereum.on('accountsChanged', load)

      window.ethereum.on("networkChanged", load);
    }
  }, [])

  return <Web3Context.Provider value={context.current}>
    {props.children}
  </Web3Context.Provider>
}
