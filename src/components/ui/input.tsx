import React, { FC } from 'react'
import { Input as RPInput, InputProps } from '@reapit/elements'
// import { css } from '@linaria/core'

export const Input: FC<InputProps> = ({ ...rest }) => {
  return (<RPInput {...rest}></RPInput>)
}

// export const globalCss = css`
//   :global() {
//     :root {
//       --component-input-focus-bg: white
//     }
//   }
// `

// :global() {
//   :root {
//     --component-input-border-bottom: 0
//     --component-input-border-bottom-focus: 0
//     --component-input-focus-bg: white
//   }
// }

export default Input