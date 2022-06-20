import "./index.css";
import {useContext, useEffect, useState} from "react";
import { Web3Context } from "../../context/web3-context";
import NFT from "../../components/nft";
import Timer from "../../components/timer";
import Button from "../../components/button";
import {config} from "../../config";
import {BigNumber} from "ethers";

interface Props {
  id: number
  onChange: () => void
}

function Room(props: Props) {
  const {id, onChange} = props;
  const { account, chainId, nest, connect} = useContext(Web3Context)
  const [loading , setLoading] = useState<boolean>()
  const [data , setData] = useState<any>()
  const [period , setPeriod] = useState<number>()
  const [canHatch , setCanHatch] = useState<boolean>()
  const [withdrawing , setWithdrawing] = useState<boolean>()

  const load = async () => {
    const info = await nest.getRoomInfo(id)
    const period = (await nest.period()).toNumber()
    setCanHatch(await nest.canHatch(id))
    setPeriod(period)
    setData({
      enterTime: info.enterTime.toNumber(),
      withdraw: info.withdraw,
      owner: info.owner,
      parentIds: info.parentIds.map((id: BigNumber) => id.toNumber())
    })
  }

  useEffect(() => {
    if( id>=0 ) {
      load()
    }
  }, [id])

  const handleWithdraw = async () => {
    if(withdrawing) {
      return false
    }
    try {
      const tx = await nest.hatch(id)
      setWithdrawing(true)
      await tx.wait()
      load()
    } catch (e) {

    }
    setWithdrawing(false)
  }

  const handleEmergency = async () => {
    if(withdrawing) {
      return false
    }

    if(!confirm('Emergency Withdraw, you won\'t get any reward, only get staked nft back')) {
      return false
    }

    try {
      const tx = await nest.emergencyWithdraw(id)
      setWithdrawing(true)
      await tx.wait()
      load()
    } catch (e) {

    }
    setWithdrawing(false)
  }

  return (
    <div className="room">
      <div className="room-inner">
        <div className="room-id">ROOM #{id}</div>
        {loading && <div className="loading">loading...</div>}
        {(data?.parentIds || []).map((tokenId: number) => {
          return <div className="room-row" key={tokenId}>
            <NFT tokenId={tokenId}/>
            <div className="room-content">DeadFly #{tokenId}</div>
          </div>
        })}
        {data && !data.withdraw && <div className="room-timer"><Timer startTime={data.enterTime * 1000} time={(period || 144000)*1000} onFinish={load} /> to hatch</div>}
        {data && data.withdraw && <div className="tips">ALREADY WITHDRAWED</div>}
        {
          data && !data.withdraw && <div className="room-actions">
            {
              canHatch && <Button size="S" onClick={handleWithdraw}>
                {withdrawing ? 'hatching...' : 'HATCH'}
              </Button>
            }
            {
              !canHatch && <Button danger size="S" className="room-emergency" onClick={handleEmergency}>
                {withdrawing ? 'withdrawing...': <>Emergency<br/>Withdraw</>}
              </Button>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Room
