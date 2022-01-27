import React from 'react'
import { ButtonProps } from '@reapit/elements'
import styles from './button.module.scss'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ intent, className, ...rest }, ref) => {
  function classes() {
    let result = 'el-button'
    if (intent === 'neutral') {
      result += ' ' + styles.neutral
    }
    if (intent === 'primary') {
      result += ' el-intent-primary'
    }
    if (intent === 'low') {
      result += ' el-intent-low'
    }
    return result + ' ' + className
  }

  return (
    <button {...rest} ref={ref} className={classes()} ></button>
  )
})

export default Button