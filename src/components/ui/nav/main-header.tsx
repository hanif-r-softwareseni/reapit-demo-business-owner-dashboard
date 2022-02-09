import React from 'react'
import { useHistory } from 'react-router-dom'
import { navigate } from 'utils/navigation'
import { Routes } from 'constants/routes'
import { styled } from '@linaria/react'
import NotificationButton from 'components/ui/notification-button'
import { space } from 'constants/theme'

export const MainHeader = () => {
  const history = useHistory()

  return (
    <StyledMainHeader>
      <MyNotificationButton />
      <AvatarImageContainer onClick={navigate(history, Routes.USER_PROFILE)}>
        <AvatarImage 
          src="https://www.biowritingservice.com/wp-content/themes/tuborg/images/Executive%20Bio%20Sample%20Photo.png"
        />
      </AvatarImageContainer>
    </StyledMainHeader>
  )
}

export const mainHeaderHeight = '60px'

export const StyledMainHeader = styled.div`
  height: ${mainHeaderHeight};
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: var(--color-white);
  border-bottom: 1px solid #ccc;
`
export const AvatarImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  margin-left: ${space[4]};
`

export const AvatarImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
`

const MyNotificationButton = styled(NotificationButton)`
  margin: 0 ${space[4]};
`

export default MainHeader
