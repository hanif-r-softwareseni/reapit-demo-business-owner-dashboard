import React, { useEffect, useMemo, useState } from 'react'
import { Loader, PageContainer, Table, Title, RowProps, TableHeadersRow, TableHeader, ElTableCell, ElTableCellContent, ElTableRow } from '@reapit/elements'
import { negotiatorsApiService } from 'platform-api/negotiator-api'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from 'core/connect-session'
import { NegotiatorModelPagedResult } from '@reapit/foundations-ts-definitions'
import { styled } from '@linaria/react'
import agetImage from 'assets/images/mehrad-profile-picture.jpg'

export const AgentsPage = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [agents, setAgents] = useState<NegotiatorModelPagedResult | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connectSession) {
      fetchAgents()
    }
  }, [connectSession])

  async function fetchAgents() {
    setLoading(true)
    const serviceResponse = await negotiatorsApiService(connectSession)

    if (serviceResponse) {
      setAgents(serviceResponse)
    }
    setLoading(false)
  }

  const agentsRowModel = useMemo<RowProps[]>((): RowProps[] => {
    let rows: RowProps[] | undefined = []

    if (agents === undefined) {
      return rows
    }

    rows = agents._embedded?.map((item): RowProps => {
      return {
        cells: [
          {
            label: 'Image',
            value: '',
            children: <AgentImage src={agetImage} />,
          },
          {
            label: 'Name',
            value: item.name ? item.name : '',
          },
          {
            label: 'Job Title',
            value: item.jobTitle ? item.jobTitle : '',
          },
          {
            label: 'Email',
            value: item.email ? item.email : '',
          },
          {
            label: 'Mobile Phone',
            value: item.mobilePhone ? item.mobilePhone : '',
          },
        ],
      }
    })

    return rows || []
  }, [agents])

  return (
    <PageContainer>
      <Title>Agents</Title>
      {loading ? (
        <Loader label="loading" />
      ) : (
        <Table>
          {agentsRowModel.map((row, index) => (
            <React.Fragment key={index}>
              {index === 0 && (
                <TableHeadersRow>
                  {row.cells.map((cell) => (
                    <TableHeader key={cell.label}>
                      {cell.label} 
                    </TableHeader>
                  ))}
                </TableHeadersRow>
              )}
              <ElTableRow>
                {row.cells.map((cell) => (
                  <TableCell key={cell.label}>
                    {cell.children ? (
                      cell.children
                    ) : (
                      <ElTableCellContent>
                        {cell.value}
                      </ElTableCellContent>
                    )}
                  </TableCell>
                ))}
              </ElTableRow>
            </React.Fragment>
          ))}
        </Table>
      )}
    </PageContainer>
  )
}

const AgentImage = styled.img`
  height: 100px;
`

const TableCell = styled(ElTableCell)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default AgentsPage