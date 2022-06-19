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

  return (
    <div className="ui-nft">
      {/*<span className="ui-nft-id">#{tokenId}</span>*/}
      <img src={`${config.baseURI}${tokenId}.png`} loading="lazy" />
    </div>
  )
}

export default NFT
