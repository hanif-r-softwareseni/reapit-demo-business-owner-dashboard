import React, { useEffect, FC, useState, useMemo } from 'react'
import {
  Title,
  elHFull,
  PageContainer,
  Loader,
  Table,
  TableHeadersRow,
  TableHeader,
  ElTableCell,
  ElTableCellContent,
  FlexContainer,
} from '@reapit/elements'
import { PropertyFilter, Icon } from 'components/ui'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { propertiesApiService, QueryParams } from '../../platform-api/properties-api'
import houseImage from 'assets/images/pexels-binyamin-mellish-house.jpg'
import styles from './properties-page.module.scss'
import { useHistory } from 'react-router-dom'
import { navigate } from 'utils/navigation'
import { Routes } from 'constants/routes'

import { PropertyModelPagedResult, PropertyAddressModel, PropertyInternalAreaModel } from '@reapit/foundations-ts-definitions'
import { RowProps } from '@reapit/elements'

type SortState = {
  [name: string]: 'asc' | 'desc'
}

interface MyRowProps extends RowProps {
  id: string
}

export const PropertiesPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [properties, setProperties] = useState<PropertyModelPagedResult | undefined>(undefined)
  const [filterQueryParams, setFilterQueryParams] = useState<QueryParams>({})
  const [isFilterReady, setIsFilterReady] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sortState, setSortState] = useState<SortState>({})
  const [sortQueryParams, setSortQueryParams] = useState<QueryParams>({})

  const history = useHistory()

  useEffect(() => {
    if (connectSession && isFilterReady) {
      fetchProperties()
    }
  }, [connectSession, filterQueryParams, isFilterReady, sortQueryParams])

  async function fetchProperties() {
    const baseQueryParams = {
      marketingMode: ['selling', 'letting'],
      embed: ['negotiator'],
      officeId: ['MKT'],
    } as QueryParams

    setLoading(true)
    const serviceResponse = await propertiesApiService(connectSession, 
      { ...baseQueryParams, ...filterQueryParams, ...sortQueryParams })

    if (serviceResponse) {
      setProperties(serviceResponse)
    }
    setLoading(false)
  }

  function applyFilter(qp: QueryParams) {
    setFilterQueryParams(qp)
  }

  function fetchIsReady(qp: QueryParams) {
    setFilterQueryParams(qp)
    setIsFilterReady(true)
  }

  const propertiesRowModel = useMemo<MyRowProps[]>((): MyRowProps[] => {
    let rows: MyRowProps[] | undefined = []

    if (properties === undefined) {
      return rows
    }

    rows = properties._embedded?.map((item): MyRowProps => {
      return {
        id: item.id || '',
        cells: [
          {
            label: 'Image',
            value: '',
            children: <img src={houseImage} className={styles.image} />,
          },
          {
            label: 'Price',
            value: presentPrice(item.selling?.price, item.currency!),
          },
          {
            label: 'Address',
            value: presentAddress(item.address as PropertyAddressModel),
          },
          {
            label: 'Agent',
            value: item._embedded?.negotiator?.name || '',
          },
          {
            label: 'Area',
            value: presentArea(item.internalArea),
          },
          {
            label: 'Bedrooms',
            value: item.bedrooms + '',
          },
          {
            label: 'Bathrooms',
            value: item.bathrooms + '',
          },
          {
            label: 'Type',
            value: presentType(item.type),
          },
          {
            label: 'Locality',
            value: presentLocality(item.locality),
          },
        ],
      }
    })

    return rows || []
  }, [properties])

  function presentPrice(price: number | undefined, currency: string): string {
    if (price === undefined) return ''

    if (currency === 'GBP') {
      return `£${price.toFixed(2)}`
    } else {
      return `£${price.toFixed(2)}`
    }
  }

  function presentAddress(addr: PropertyAddressModel): string {
    const lines = [addr.line1, addr.line2, addr.line3, addr.line4]
    const strLines = lines.filter((line) => line !== '' && line !== undefined).join(', ')
    return `${strLines}, building number: ${addr.buildingNumber}, postal code: ${addr.postcode}`
  }

  function presentArea(area: PropertyInternalAreaModel | undefined | null): string {
    if (!area) return ''

    let unit = ''
    if (area.type === 'squareFeet') {
      unit = 'ft\u00B2'
    }
    if (area.type === 'squareMetres') {
      unit = 'm\u00B2'
    }

    return `${area.min}${unit}, ${area.max}${unit}`
  }

  function presentType(type: string[] | undefined | null) {
    if (!type) return ''

    return type.map((t) => {
      if (t === 'flatApartment') return 'flat apartment'
      return t
    }).join(', ')
  }

  function presentLocality(locality: string[] | undefined | null) {
    if (!locality) return ''

    return locality.map((loc) => {
      if (loc === 'village') return 'Suburban'
      if (loc === 'rural') return 'Rural'
      if (loc === 'townCity') return 'Urban'
      return loc
    }).join(', ')
  }

  function toggleSort(label) {
    let newSortState: SortState = {}
    if (sortState[label] === undefined) {
      newSortState = { [label]: 'asc' }
    }

    if (sortState[label] === 'asc') {
      newSortState = { [label]: 'desc' }
    } else {
      newSortState = { [label]: 'asc' }
    }
    setSortState(newSortState)
    setSortQueryParams({ sortBy: `${newSortState[label] === 'desc' ? '-' : ''}${label}` })
  }

  return (
    <PageContainer className={elHFull}>
      <Title>Property List</Title>
      <FlexContainer className="el-mb6">
        <PropertyFilter onApply={applyFilter} onFilterReady={fetchIsReady} />
      </FlexContainer>
      {loading ? (
        <Loader label="loading" />
      ) : (
        <Table>
          {propertiesRowModel.map((row, index) => (
            <React.Fragment key={index}>
              {index === 0 && (
                <TableHeadersRow>
                  {row.cells.map((cell) => (
                    <TableHeader key={cell.label} 
                    onClick={() => toggleSort(cell.label)}
                    >
                      {cell.label} 
                      <span className="el-ml2">
                        {sortState[cell.label] === 'asc' && (
                          <Icon asset="fontawesome" icon="long-arrow-alt-up" style={{ fontSize: '15px'}} />
                        )}
                        {sortState[cell.label] === 'desc' && (
                          <Icon asset="fontawesome" icon="long-arrow-alt-down" style={{ fontSize: '15px'}} />
                        )}
                      </span>
                      
                      
                    </TableHeader>
                  ))}
                </TableHeadersRow>
              )}
              <div 
                className={`el-table-row ${styles.row}`} 
                onClick={navigate(history, `${Routes.PROPERTIES}/${row.id}`)}
              >
                {row.cells.map((cell) => (
                  <ElTableCell key={cell.label}>
                    {cell.children ? (
                      cell.children
                    ) : (
                      <ElTableCellContent className={styles.cellContent}>
                        {cell.value}
                      </ElTableCellContent>
                    )}
                  </ElTableCell>
                ))}
              </div>
            </React.Fragment>
          ))}
        </Table>
      )}
    </PageContainer>
  )
}

export default PropertiesPage
