import React, { FC } from 'react'
import {
  Title,
  elHFull,
  PageContainer,
  FlexContainer,
} from '@reapit/elements'
import { useParams, useHistory } from 'react-router-dom'
import { Icon } from 'components/ui'

export const PropertyDetailsPage: FC = () => {
  const { id } = useParams<any>()
  const history = useHistory()

  return (
    <PageContainer className={elHFull}>
      <FlexContainer className="el-mb4" onClick={() => history.goBack()}>
        <div className="el-mr4">
          <Icon asset="fontawesome" icon="arrow-left" style={{ fontSize: '24px', color: 'rgb(149, 149, 149)' }} />
        </div>
        <div style={{ fontSize: '18px', color: 'rgb(149, 149, 149)', lineHeight: 1.5 }}>
          Property List
        </div>
      </FlexContainer>
      <Title>Property Details {id}</Title>
    </PageContainer>
  )
}

export default PropertyDetailsPage