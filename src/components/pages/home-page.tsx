import React, { FC } from 'react'
import { PageContainer, CardWrap, FlexContainer } from '@reapit/elements'
import { CardHeader }  from 'components/ui/card-header'
import { styled } from '@linaria/react'
import { space } from 'constants/theme'

export const HomePage: FC = () => (
  <PageContainer>
    <FlexContainer>
      <StyledCardWrapper>
        <CardWrap>
          <CardHeader>
            Sales Revenue
          </CardHeader>
          <div>
            <p className="el-mb2">
              current month:
            </p>
            <div className="el-fs-6">
              £1,250,000.00
            </div>
          </div>
        </CardWrap>
      </StyledCardWrapper>
      <StyledCardWrapper>
        <CardWrap>
          <CardHeader>
            Rent Revenue
          </CardHeader>
          <div>
            <p className="el-mb2">
              current month:
            </p>
            <div className="el-fs-6">
              £1,234,456.00
            </div>
          </div>
        </CardWrap>
      </StyledCardWrapper>
      <StyledCardWrapper></StyledCardWrapper>
      <StyledCardWrapper></StyledCardWrapper>
    </FlexContainer>
  </PageContainer>
)

const StyledCardWrapper = styled.div`
  width: 100px; 
  flex-grow: 1;
  margin-right: ${space[4]};
  margin-left: ${space[4]};
`

export default HomePage
