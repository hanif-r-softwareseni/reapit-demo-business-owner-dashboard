import React, { useState } from 'react'
import { FlexContainer, InputGroup, PageContainer, Title, Grid, Col, useSnack } from '@reapit/elements'
import { styled } from '@linaria/react'
import { Button } from 'components/ui'
import { space } from 'constants/theme'

type UserProfile = {
  name: string
  email: string
  mobilePhone: string
}

export const UserProfilePage = () => {
  const [userProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobilePhone: '123456789',
  })
  const { success } = useSnack()

  return (
    <PageContainer>
      <Title>User Profile</Title>
      <FlexContainer>
        <ProfileImageContainer>
          <ProfileImage src="https://www.biowritingservice.com/wp-content/themes/tuborg/images/Executive%20Bio%20Sample%20Photo.png" />
        </ProfileImageContainer>
        <div className="el-flex-grow el-p4">
          <Grid className="el-mb4 el-p4">
            <Col>
              <InputGroup label="Name" value={userProfile.name} />
            </Col>
            <Col>
              <InputGroup label="Email" value={userProfile.email} />
            </Col>
            <Col>
              <InputGroup label="Mobile Phone" value={userProfile.mobilePhone} />
            </Col>
          </Grid>
          <FlexContainer isFlexJustifyEnd>
            <Button intent="primary" onClick={() => success('User profile saved')}>Save</Button>
          </FlexContainer>
        </div>
      </FlexContainer>
    </PageContainer>
  )
}

const ProfileImage = styled.img`
  width: 270px;
  object-fit: cover;
`

const ProfileImageContainer = styled.div`
  padding: ${space[4]};
  border: 1px solid #ccc;
`

export default UserProfilePage