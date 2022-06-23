import {useContext, useEffect, useState} from 'react'
import { ethers } from "ethers";
import {Web3Context, Web3ContextValue} from "../../context/web3-context";
import {iteratee} from "lodash-es";
import { config } from "../../config";
import "./index.css";

interface Props {
  tokenId: number
}

function NFT(props: Props) {
  const { tokenId } = props
  const { account, connect, updateContext } = useContext(Web3Context)
  const url = tokenId > 2000 ? config.eggURI : `${config.baseURI}${tokenId}.png`
  return (
    <div className="ui-nft">
      <img src={url} loading="lazy" />
    </div>
  )
}

export default NFT
