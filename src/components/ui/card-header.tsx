import React, { FC } from 'react'
import { styled } from '@linaria/react'

export const CardHeader: FC = ({ children }) => {
  
  return (
    <StyledCardHeader className="el-fs-6 el-pb4 el-mb4">
      {children}
    </StyledCardHeader>
  )
}

const StyledCardHeader = styled.div`
  border-bottom: 1px solid #ccc;
`

export default CardHeader