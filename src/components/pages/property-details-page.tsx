import React, { FC, useState, useEffect } from 'react'
import {
  Title,
  elHFull,
  PageContainer,
  FlexContainer,
  CardWrap,
  CardMainWrap,
  Loader,
} from '@reapit/elements'
import { useParams, useHistory } from 'react-router-dom'
import { Icon } from 'components/ui'
import { LineChart, Line, YAxis, CartesianGrid, XAxis, Tooltip } from 'recharts'
import dayjs from 'dayjs'
import { pound } from 'utils/currency-format'
import { reapitConnectBrowserSession } from 'core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { getPropertyById } from 'platform-api/properties-api'

import { PropertyModel } from '@reapit/foundations-ts-definitions'

export const PropertyDetailsPage: FC = () => {
  const { id } = useParams<any>()
  const history = useHistory()
  const [property, setProperty] = useState<PropertyModel | undefined>(undefined)
  const [priceData] = useState(getPriceData())
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (connectSession) {
      fetchProperty()
    }
  }, [connectSession])

  async function fetchProperty() {
    setLoading(true)
    const serviceResponse = await getPropertyById(connectSession, id)

    if (serviceResponse) {
      setProperty(serviceResponse)
    }
    setLoading(false)
  }

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
      <Title>Property {id}</Title>
      {loading ? (
        <Loader label="loading" />
      ) : (
        <>
          <CardWrap className="el-my4">
            <CardMainWrap>
              <div className="el-details-card-heading">Features</div>
            </CardMainWrap>
            <FlexContainer>
              <div className="el-flex-grow">
                <div className="el-my4">
                  <div className="el-info-caption-text">Type</div>
                  <p>{property?.type?.[0]}</p>
                </div>
                <div className="el-my4">
                  <div className="el-info-caption-text">Locality</div>
                  <p>urban</p>
                </div>
              </div>
              <div className="el-details-card-right el-flex-grow">
                <div className="el-my4">
                  <div className="el-info-caption-text">Bedrooms</div>
                  <p>{property?.bedrooms}</p>
                </div>
                <div className="el-my4">
                  <div className="el-info-caption-text">Bathrooms</div>
                  <p>{property?.bathrooms}</p>
                </div>
              </div>
            </FlexContainer>
          </CardWrap>
          <CardWrap className="el-my4">
            <CardMainWrap>
              <div className="el-details-card-heading">Price History</div>
            </CardMainWrap>
            <LineChart className="el-my3" width={800} height={400} data={priceData}>
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={3} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => pound(value)} width={120} />
              <Tooltip formatter={(value: number) => pound(value)} />
            </LineChart>
          </CardWrap>
        </>
      )}
    </PageContainer>
  )
}

function getPriceData() {
  const results: {
    name: string
    price: number
  }[] = []

  let date = dayjs('2022-01-01')
  for (let i = 0; i < 30; i++) {
    results.push({ name: date.format('YYYY-MM-DD'), price: random(1, 50) * 100 })
    date = date.add(1, 'day')
  }

  

  return results
}

function random(start: number, end: number) {
  const delta = end - start
  return start + Math.floor(Math.random() * (delta + 1))
}

export default PropertyDetailsPage