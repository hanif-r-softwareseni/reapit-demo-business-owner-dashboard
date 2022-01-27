import React, { FC } from 'react'
import {
  Title,
  elHFull,
  PageContainer,
} from '@reapit/elements'
import { useParams } from 'react-router-dom'

export const PropertyDetailsPage: FC = () => {
  const { id } = useParams<any>()

  return (
    <PageContainer className={elHFull}>
      <Title>Property Details {id}</Title>
    </PageContainer>
  )
}

export default PropertyDetailsPage