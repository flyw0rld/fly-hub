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
