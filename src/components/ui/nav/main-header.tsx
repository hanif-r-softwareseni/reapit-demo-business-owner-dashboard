import React from 'react'
import { AvatarImage, StyledMainHeader, AvatarImageContainer } from './__styles__/main-header'

export const MainHeader = () => {
  return (
    <StyledMainHeader>
      <AvatarImageContainer>
        <AvatarImage 
          src="https://www.biowritingservice.com/wp-content/themes/tuborg/images/Executive%20Bio%20Sample%20Photo.png"
        />
      </AvatarImageContainer>
    </StyledMainHeader>
  )
}

export default MainHeader
