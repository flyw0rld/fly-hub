import {PropsWithChildren, useContext, useEffect, useRef, useState} from 'react'
import { ethers } from "ethers";
import mp3 from "../../audio/bg.mp3";
import {delay} from "../../utils";
import classNames from "classnames";
import "./index.css";

type Props = PropsWithChildren<{
 className?: string
  shake?: boolean
}>

function Fly(props: Props) {
  const { children, className, shake } = props
  const audioRef = useRef<HTMLAudioElement>(null)
  const shouldPause = useRef<boolean>(false)

  const handleEnter = () => {
    if(!!audioRef.current?.paused) {
      audioRef.current?.play()
      shouldPause.current = false
    }
  }

  const handleLeave = () => {
    console.log('L E A V E');
    shouldPause.current = true
    delay(500).then(() => {
      audioRef.current?.pause()
    })
  }

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={classNames('ui-fly', {'ui-fly-no-shake': shake === false}, className)}>
      {children}
      <audio src={mp3} loop ref={audioRef}/>
    </div>
  )
}

export default Fly
