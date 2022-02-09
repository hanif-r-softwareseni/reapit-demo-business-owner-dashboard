import { styled } from '@linaria/react'
import { fontSize, space } from 'constants/theme'
import React, { FC, useEffect, useState } from 'react'
import Icon from './icon'

type Props = {
  style?: React.CSSProperties
  className?: string
}

export const NotificationButton: FC<Props> = ({ className, style }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [isRead, setIsRead] = useState(false)

  useEffect(() => {
    if (menuIsOpen) {
      setIsRead(true)
    }
  }, [menuIsOpen])

  return (
    <StyledNotificationButton className={className} style={style}>
      <div onClick={() => setMenuIsOpen(!menuIsOpen)}>
        <MyIcon asset="fontawesome" icon="bell" />
        {!isRead && (
          <Badge></Badge>
        )}
      </div>
      {menuIsOpen && (
        <DropdownMenu>
          <DropdownMenuItem>{"Today is John Doe's birthday"}</DropdownMenuItem>
          <DropdownMenuItem>{"Today is John Doe's 21st anniversary"}</DropdownMenuItem>
          <DropdownMenuItem>{"Today is John Doe's birthday"}</DropdownMenuItem>
        </DropdownMenu>
      )}
    </StyledNotificationButton>
  )
}

const StyledNotificationButton = styled.div`
  position: relative;
  z-index: 100;
`

const MyIcon = styled(Icon)`
  font-size: 26px;
`

const Badge = styled.div`
  background-color: red;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 8px;
  color: white-space;
`

const DropdownMenu = styled.div`
  background-color: white;
  border-radius: 10px;
  position: absolute;
  top: 100%;
  right: 0;
  padding: ${space[4]};
  width: 300px;
  border: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
  margin-top: ${space[1]};
`

const DropdownMenuItem = styled.div`
  padding: ${space[2]};
  border-bottom: 1px solid #ccc;
  font-size: ${fontSize[7]};
`

export default NotificationButton