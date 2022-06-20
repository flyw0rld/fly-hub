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
let audio

try {
  audio = new Audio(mp3)
  audio.loop = true;
}catch (e) {
  console.log('not support audio')
}

function detectMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

if(detectMobile()) {
  window.addEventListener('devicemotion', function () {
    audio?.play();
  }, false);
  window.addEventListener('touchstart', function () {
    audio?.play();
  }, false);
}

function Fly(props: Props) {
  const { children, className, shake } = props
  const shouldPause = useRef<boolean>(false)

  const handleEnter = () => {
    if(!!audio?.paused) {
      audio?.play()
      shouldPause.current = false
    }
  }

  const handleLeave = () => {
    console.log('L E A V E');
    shouldPause.current = true
    delay(500).then(() => {
      audio?.pause()
    })
  }

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={classNames('ui-fly', {'ui-fly-no-shake': shake === false}, className)}>
      {children}
    </div>
  )
}

export default Fly
