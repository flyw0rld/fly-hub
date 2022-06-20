import "./index.css";
import {useContext, useEffect, useState} from "react";
import { Web3Context } from "../../context/web3-context";
import type {BigNumber} from "ethers";
import Room from "./room";
import Breed from "./breed";

function Nest() {
  const { account, chainId, nest, connect} = useContext(Web3Context)
  const [loading , setLoading] = useState<boolean>()
  const [shouldShowModal , setShowModal] = useState<boolean>(false)
  const [roomIds , setRoomIds] = useState<number[]>([])

  const load = async (address?: string  | null) => {
    setLoading(true)
    console.log('load');
    try {
      if(address) {
        const roomIds = await nest.getRoomForUser(address)
        setRoomIds(roomIds.map((id: BigNumber) => id.toNumber()))
      }
    }catch (e){
      console.log(e);
    }
    setLoading(false)
  }

  useEffect(() => {
    load(account)
  },[account, chainId])

  const  handleAdd = () => {
    if(account) {
      setShowModal(true)
    }else {
      connect()
    }
  }


  return (
    <div className="nest_container">
      <div className="nest">
        <div className="nest-desc">This is the spawning space of the fly world. Click on the plus sign to add your flies (must be a multiple of 2), every two of them will produce one egg after 48 hours and the baby flies will appear soon. If you exit in the middle of an emergency, you won't get any reward, only the original pledged nft back</div>
        {loading && <div className="loading">loading...</div>}
        <div className="room-list">
          {roomIds.map((id) => {
            return <Room id={id} key={id} onChange={() => {
              load(account)
            }}
            />
          })}
          <div className="room">
            <div className="room-inner nest-add" onClick={handleAdd}>
            </div>
          </div>
        </div>
      </div>
      <Breed visible={shouldShowModal}
             onClose={() => setShowModal(false)}
             onSuccess={() => {
               load(account)
               setShowModal(false)
             }}
      />
    </div>
  )
}

export default Nest
