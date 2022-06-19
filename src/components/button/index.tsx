import {PropsWithChildren, useContext, useEffect, useRef, useState} from 'react'
import classnames from 'classnames'
import './index.css'

type Props = PropsWithChildren<{
 className?: string
 size?: 'L' | 'M' | 'S'
 danger?: boolean
 disabled?: boolean
 onClick?: () => void
}>

function Button(props: Props) {
  const {className, size, children, danger, ...rest} = props

  return (
    <button className={classnames(
      'ui-button',
      `ui-button-size-${size || 'M'}`,
      {['ui-button-danger']:danger},
      className)}
            {...rest}>
      {children}
    </button>
  )
}

export default Button
