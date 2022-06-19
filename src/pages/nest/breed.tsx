import "./index.css";
import {useContext, useEffect, useState} from "react";
import { Web3Context } from "../../context/web3-context";
import Button from "../../components/button";
import Fly from "../../components/audio";
import classNames from "classnames";
import NFT from "../../components/nft";
import {config} from "../../config";


interface Props {
  onClose: () => void
  onSuccess: () => void
  visible: boolean
}

function Breed(props: Props) {
  const { onClose , visible} = props
  const { account, chainId, nft, nest, connect} = useContext(Web3Context)
  const [loading , setLoading] = useState<boolean>()
  const [approving , setApproving] = useState<boolean>()
  const [isApprove , setIsApprove] = useState<boolean>(null)
  const [tokens , setTokens] = useState<number[]>([])
  const [selected , setSelected] = useState<number[]>([])

  const load = async (account: string) => {
    setLoading(true)
    const approve = await nft.isApprovedForAll(account, config.NEST)
    const ids = (await nft.tokensOfOwner(account)).map(id => id.toNumber())
    setIsApprove(approve)
    setSelected(ids.slice(0, 2))
    setTokens(ids)
    setLoading(false)
  }

  useEffect(() => {
    if(visible && account) {
      load(account)
    }
    if(!visible) {
      setSelected([])
    }
  }, [visible])

  const handleSelect = (id: number) => {
    if(selected.includes(id)) {
      setSelected(selected.filter(item => item !== id))
    } else {
      setSelected(selected.concat(id))
    }
  }

  const handleApprove = async () => {
    if(approving) {
      return false
    }
    try {
      const tx = await nft.setApprovalForAll(config.NEST, true)
      setApproving(true)
      await tx.wait()
      load(account as string);
    } catch (e) {

    }
    setApproving(false)
  }

  const handleBreed = async  () => {
    if(selected.length  === 2) {
      try {
        const tx = await nest.breed(selected)
        setApproving(true)
        await tx.wait()
        props.onSuccess()
      } catch (e) {

      }
      setApproving(false)
    }
  }

  const disabled = selected.length < 2

  return visible && (
    <div className="ui-modal">
      <div className="ui-modal-backdrop" />
      <div className="ui-modal-content">
        <div className="ui-modal-inner">
          {loading && <div className="loading">loading...</div>}
          {!loading && tokens.length === 0 && <div className="tips">You don't have enough DeadFly, welcome to buy it at opensea.</div>}
          <div className='token-list'>
            {tokens.map((tokenId) => {
              const hasSelected = selected.includes(tokenId)
              return <div key={tokenId} className={classNames('token-item', {
                  'active': hasSelected,
                  'disable': selected.length >=2 && !hasSelected,
                })}>
                <div className="token-item-main" onClick={() => handleSelect(tokenId)}>
                  <NFT tokenId={tokenId} />
                </div>
                <span>#{tokenId}</span>
              </div>
            })}
          </div>
          {
            loading === false && <div className="ui-modal-action">
              {
                tokens.length <2 && <Button size="M" onClick={() => {
                  location.href = config.opensea
                }}>
                  GO
                </Button>
              }
              {
                tokens.length >0 && !isApprove && <Fly>
                  <Button size="M" onClick={handleApprove}>
                    {approving ? 'APPROVING...': 'APPROVE'}
                  </Button>
                </Fly>
              }
              {
                tokens.length >0 && isApprove && <Fly shake={!disabled}>
                <Button size="M" disabled={disabled} onClick={handleBreed}>
                  {disabled ? 'Need 2 Flies' : approving ? 'BREEDING...': 'BREED'}
                </Button>
              </Fly>
              }
            </div>
          }
        </div>
        <div className="ui-modal-close" onClick={onClose} />
      </div>
    </div>
  )
}

export default Breed
