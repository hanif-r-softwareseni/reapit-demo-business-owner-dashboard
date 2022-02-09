import React, { FC, useEffect, useState } from 'react'
import { PageContainer, CardWrap, FlexContainer } from '@reapit/elements'
import { CardHeader }  from 'components/ui/card-header'
import { styled } from '@linaria/react'
import { space } from 'constants/theme'
import { Icon } from 'components/ui'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import dayjs from 'dayjs'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from 'core/connect-session'
import { propertiesApiService } from 'platform-api/properties-api'
import { negotiatorsApiService } from 'platform-api/negotiator-api'
import { applicantsApiService } from 'platform-api/applicants-api'

export const HomePage: FC = () => {
  const [salesData] = useState(getSalesData())
  const [salesPerRegionData] = useState(getSalesPerRegionData())
  const [propertyCount, setPropertyCount] = useState(-1)
  const [agentCount, setAgentCount] = useState(-1)
  const [applicantCount, setApplicantCount] = useState(-1)

  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  useEffect(() => {
    if (connectSession) {
      fetchData()
    }
  }, [connectSession])

  async function fetchData() {
    const [properties, agents, applicants] = await Promise.all([
      propertiesApiService(connectSession), 
      negotiatorsApiService(connectSession), 
      applicantsApiService(connectSession)
    ])

    setPropertyCount(properties!.totalCount!)
    setAgentCount(agents!.totalCount!)
    setApplicantCount(applicants!.totalCount!)
  }

  return (
    <PageContainer>
      <CardRow isFlexJustifyCenter>
        <CountContainer>
          <MyCardWrap>
            <CardHeader>
              Properties
            </CardHeader>
            <FlexContainer isFlexAlignCenter isFlexJustifyCenter isFlexGrow1>
              <CardIcon asset="fontawesome" icon="building" />
              <div className="el-fs-4">
                {propertyCount >= 0 ? propertyCount : '...'}
              </div>
            </FlexContainer>
          </MyCardWrap>
        </CountContainer>
        <CountContainer>
          <MyCardWrap>
            <CardHeader>
              Agents
            </CardHeader>
            <FlexContainer isFlexAlignCenter isFlexJustifyCenter isFlexGrow1>
              <CardIcon asset="fontawesome" icon="user-tie" />
              <div className="el-fs-4">
                {agentCount >= 0 ? agentCount : '...'}
              </div>
            </FlexContainer>
          </MyCardWrap>
        </CountContainer>
        <CountContainer>
          <MyCardWrap>
            <CardHeader>
              Applicants
            </CardHeader>
            <FlexContainer isFlexAlignCenter isFlexJustifyCenter isFlexGrow1>
              <CardIcon asset="fontawesome" icon="user-friends" />
              <div className="el-fs-4">
                {applicantCount >= 0 ? applicantCount : '...'}
              </div>
            </FlexContainer>
          </MyCardWrap>
        </CountContainer>
      </CardRow>
      <CardRow>
        <CardContainer>
          <MyCardWrap>
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
          </MyCardWrap>
        </CardContainer>
        <CardContainer>
          <MyCardWrap>
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
          </MyCardWrap>
        </CardContainer>
      </CardRow>
      <CardRow>
        <ChartContainer>
          <MyCardWrap>
            <CardHeader>
              Sales Chart
            </CardHeader>
            <FlexContainer isFlexGrow1>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart className="el-my3" data={salesData} margin={{ left: -60}}>
                  <Line type="monotone" dataKey="sales" stroke="#253495" strokeWidth={3} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" tickMargin={8} />
                  <YAxis tickFormatter={(value) => value} width={120} tickMargin={8} />
                  <Tooltip formatter={(value: number) => value} />
                </LineChart>
              </ResponsiveContainer>
            </FlexContainer>
          </MyCardWrap>
        </ChartContainer>
        <ChartContainer>
          <MyCardWrap>
            <CardHeader>
              Sales per Region Chart
            </CardHeader>
            <FlexContainer isFlexGrow1>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart className="el-my3" data={salesPerRegionData} margin={{ left: -60}}>
                  <Bar dataKey="sales" fill="#253495" />
                  <XAxis dataKey="region" tickMargin={8} />
                  <YAxis tickFormatter={(value) => value} width={120} tickMargin={8} />
                  <Tooltip formatter={(value: number) => value} />
                </BarChart>
              </ResponsiveContainer>
            </FlexContainer>
          </MyCardWrap>
        </ChartContainer>
      </CardRow>
    </PageContainer>
  )
}

function getSalesData() {
  const results: {
    name: string
    sales: number
  }[] = []

  let date = dayjs('2021-01-01')
  for (let i = 0; i < 12; i++) {
    results.push({ name: date.format('YYYY-MM'), sales: random(20, 100) })
    date = date.add(1, 'month')
  }
  
  return results
}

function getSalesPerRegionData() {
  const results: {
    region: string
    sales: number
  }[] = []

  const startingCharCode = 65
  for (let i = 0; i < 6; i++) {
    results.push({ region: String.fromCharCode(startingCharCode + i), sales: random(1, 50) })
  }
  
  return results
}

function random(start: number, end: number) {
  const delta = end - start
  return start + Math.floor(Math.random() * (delta + 1))
}

const CardRow = styled(FlexContainer)`
  margin-bottom: ${space[8]};
`

const BaseCardContainer = styled.div`
  height: 150px;
  margin-right: ${space[4]};
  margin-left: ${space[4]};

  &:nth-child(1) {
    margin-left: 0;
  }

  &:nth-last-child(1) {
    margin-right: 0;
  }
`

const CardContainer = styled(BaseCardContainer)`
  width: 100px; 
  flex-grow: 4;
`
const CountContainer = styled(BaseCardContainer)`
  width: 20%;
`

const ChartContainer = styled(BaseCardContainer)`
  height: 450px;
  width: 100px; 
  flex-grow: 1;
`

const MyCardWrap = styled(CardWrap)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const CardIcon = styled(Icon)`
  font-size: 38px;
  margin-right: ${space[6]};
`

export default HomePage
