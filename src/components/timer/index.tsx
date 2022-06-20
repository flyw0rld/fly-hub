import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

interface TagProps {
  time?: number
  startTime: number
  onFinish?: () => void
}

const Timer = (props: PropsWithChildren<TagProps>) => {
  const { time, startTime, onFinish, ...rest } = props
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const set = () => {
      if (startTime) {
        const diff = Math.max(
          new Date(startTime).getTime() + (time || 0) + (20 * 1000) - Date.now(),
          0,
        )
        setProgress(diff / 1000)
        return diff
      } else {
        return 0
      }
    }
    set()
    const interval = setInterval(() => {
      if (startTime) {
        const diff = set()
        if (diff <= 0) {
          onFinish?.()
          clearInterval(interval)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const text = useMemo(() => {
    const h = progress / 60 / 60;
    const m = progress / 60 ;
    return `${h>1 ? `${Math.floor(h)} Hours` : '' } ${
      m>1 ? `${Math.floor(m % 60)} Minutes` : ''
    } ${Math.floor(progress % 60)} Seconds`
  }, [progress])

  return (
    <span className="" {...rest}>
      {text}
    </span>
  )
}

export default Timer
