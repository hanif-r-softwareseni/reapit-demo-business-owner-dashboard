import React, { FC } from 'react'
import { TextAreaProps } from '@reapit/elements'
import TextareaAutosize from 'react-textarea-autosize'
import { styled } from '@linaria/react'

interface Props extends TextAreaProps {
  maxRows?: number
  minRows?: number
  onHeightChange?: (height: number, options: { rowHeight: number}) => void
}

const UnstyledTextarea: FC<Props> = ({ 
  maxRows, minRows, onHeightChange, placeholder, value, onChange, className,
  style, ...rest
}) => {
  return (<TextareaAutosize maxRows={maxRows} minRows={minRows} onHeightChange={onHeightChange}
    placeholder={placeholder} value={value} onChange={onChange} className={className} style={style as any}
    {...rest} />)
}

export const Textarea = styled(UnstyledTextarea)`
  margin: 0;
  resize: none;
  border: 0;
  font: inherit;
  font-size: 18px;
  width: 100%;

  &::placeholder {
    font-size: 16px;
  }

  &:focus {
    outline: none
  }
`

export default Textarea