import React, { FC, useState, useRef, useEffect } from 'react'
import { QueryParams } from 'platform-api/properties-api'
import { FlexContainer, Select } from '@reapit/elements'
import Button from './button'
import { Range } from 'rc-slider'
import { pound } from 'utils/currency-format'
import { range } from 'utils/number'

import 'rc-slider/assets/index.css'
import styles from './property-filter.module.scss'

type RangeFilter = {
  from: number
  to: number
  min: number
  max: number
}

type SingleChoiceFilter = {
  value: string
  options: {
    label: string
    value: string
  }[]
}

type MultipleChoicesFilter = {
  value: string[]
  options: {
    label: string
    value: string
  }[]
}

type NoMaxLimitRangeFilter = {
  from: number
  to: number
  min: number
  max: number
}

type AllFilterCriterion = RangeFilter | SingleChoiceFilter | NoMaxLimitRangeFilter | MultipleChoicesFilter

interface FilterState {
  [name: string]: AllFilterCriterion
}

interface PropertyFilterState extends FilterState {
  price: RangeFilter
  type: SingleChoiceFilter
  locality: MultipleChoicesFilter
  bedrooms: NoMaxLimitRangeFilter
  bathrooms: NoMaxLimitRangeFilter
}

type ChangeFilterFunc = (name: string, params: Partial<AllFilterCriterion>) => void

type Props = {
  onApply: (queryParams: QueryParams) => void
  onFilterReady?: (queryParams: QueryParams) => void
  onFilterChange?: (filter: FilterState) => void
}

export const InitState: PropertyFilterState = {
  price: {
    from: 0,
    to: 100000,
    min: 0,
    max: 550000,
  },
  type: {
    value: 'any',
    options: [
      { label: 'Any', value: 'any'},
      { label: 'House', value: 'house'},
      { label: 'Bungalow', value: 'bungalow' },
      { label: 'Flat Apartment', value: 'flatApartment'},
      { label: 'Maisonette', value: 'maisonette' },
      { label: 'Land', value: 'land' },
      { label: 'Farm', value: 'farm' },
      { label: 'Cottage', value: 'cottage' },
      { label: 'Studio', value: 'studio' },
      { label: 'Townhouse', value: 'townhouse' },
    ]
  },
  locality: {
    value: [],
    options: [
      {
        label: 'Suburban',
        value: 'village',
      },
      {
        label: 'Urban',
        value: 'townCity',
      },
      {
        label: 'Rural',
        value: 'rural',
      }
    ]
  },
  bedrooms: {
    from: 0,
    to: Infinity,
    min: 0,
    max: 5
  },
  bathrooms: {
    from: 0,
    to: Infinity,
    min: 0,
    max: 5
  }
}

export const PropertyFilter: FC<Props> = ({ onApply, onFilterReady }) => {
  const [filterData, setFilterData] = useState<PropertyFilterState>(InitState)
  const previousQueryParams = useRef<QueryParams>({})

  useEffect(() => {
    onFilterReady && onFilterReady(getQueryParams())
  }, [])

  function changeFilter(name: string, params: Partial<AllFilterCriterion>) {
    const newFilter = { ...filterData[name], ...params as AllFilterCriterion }
    setFilterData({ ...filterData, [name]: newFilter })
  }

  function apply() {
    doApply(getQueryParams())
  }

  function getQueryParams(aFilterData?: PropertyFilterState) {
    aFilterData = aFilterData ? aFilterData : filterData
    return Object.entries(aFilterData).reduce((queryParams, [name, fil]) => {
      
      if (name === 'price') {
        fil = fil as RangeFilter
        queryParams['priceFrom'] = fil.from
        queryParams['priceTo'] = fil.to
      }

      if (name === 'type') {
        fil = fil as SingleChoiceFilter
        if (fil.value !== 'any') {
          queryParams['type'] = [fil.value as any]
        }
      }

      if (name === 'locality') {
        fil = fil as MultipleChoicesFilter
        queryParams['locality'] = fil.value as any
      }

      if (name === 'bedrooms') {
        fil = fil as NoMaxLimitRangeFilter
        queryParams['bedroomsFrom'] = fil.from
        if (fil.to !== Infinity) {
          queryParams['bedroomsTo'] = fil.to
        }
      }

      if (name === 'bathroms') {
        fil = fil as NoMaxLimitRangeFilter
        // 
      }

      return queryParams
    }, {} as QueryParams)
  }

  function reset() {
    setFilterData(InitState)
    doApply(getQueryParams(InitState))
  }

  function doApply(queryParams: QueryParams) {
    if (JSON.stringify(queryParams) === JSON.stringify(previousQueryParams.current)) return
    previousQueryParams.current = queryParams
    onApply(queryParams)
  }

  return (
    <div className={`el-w-full el-p4 ${styles.filterContainer}`}>
      <FlexContainer className="el-w-full el-mb4">
        <PriceFilterView price={filterData.price} onChangeFilter={changeFilter} />
        <TypeFilterView type={filterData.type} onChangeFilter={changeFilter} />
        <LocalityFilterView locality={filterData.locality} onChangeFilter={changeFilter} />
        <BedroomsFilterView bedrooms={filterData.bedrooms} onChangeFilter={changeFilter} />
        <BathroomsFilterView bathrooms={filterData.bathrooms} onChangeFilter={changeFilter} />
      </FlexContainer>
      <FlexContainer isFlexJustifyEnd>
        <Button intent="neutral" className="el-mr4" onClick={() => reset()} >Reset</Button>
        <Button intent="primary" onClick={() => apply()}>Apply Filter</Button>
      </FlexContainer>
    </div>
  )
}

type PriceFilterViewProps = {
  price: RangeFilter
  onChangeFilter: ChangeFilterFunc
}

function PriceFilterView({ price, onChangeFilter }: PriceFilterViewProps) {
  function changePriceFilter(val: number[]) {
    onChangeFilter('price', { from: val[0], to: val[1] })
  }

  return (
    <div className={`el-mr2 el-p3 ${styles.filterItem}`}>
      <div className="el-fs-6 el-mb3 el-white-text">
        Price
      </div>
      <div className="el-fs-8 el-mb2 el-white-text">
        {pound(price.from)} - {pound(price.to)}
      </div>
      <div className="el-px2">
        <Range
          allowCross={false}
          min={price.min}
          max={price.max}
          value={[price.from, price.to]}
          onChange={changePriceFilter}
          trackStyle={[{ backgroundColor: 'var(--color-blue-light2)' }]}
          handleStyle={[
            { backgroundColor: 'var(--intent-critical)', border: '0' },
            { backgroundColor: 'var(--intent-critical)', border: '0' },
          ]}
          railStyle={{ backgroundColor: 'white' }}
        >
        </Range>
      </div>
    </div>
  )
}

type TypeFilterViewProps = {
  type: SingleChoiceFilter
  onChangeFilter: ChangeFilterFunc
}

function TypeFilterView({ type, onChangeFilter}: TypeFilterViewProps) {
  function changeTypeFilter(val: string) {
    onChangeFilter('type', { value: val })
  }

  return (
    <FlexContainer 
      isFlexColumn className={`el-mx2 el-p3 ${styles.filterItem}`}
    >
      <div className="el-fs-6 el-mb3 el-white-text">
        Type
      </div>
      <div className="el-fs-8 el-my-auto">
        <Select value={type.value} onChange={(ev) => changeTypeFilter(ev.target.value)}>
          {type.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </div>
    </FlexContainer>
  )
}

type LocalityFilterViewProps = {
  locality: MultipleChoicesFilter
  onChangeFilter: ChangeFilterFunc
}

function LocalityFilterView({ locality, onChangeFilter }: LocalityFilterViewProps) {
  function changeLocalityFilter(val: string) {
    const exist = locality.value.find((v) => v === val)

    let selected: string[] = []
    if (!exist) {
      selected = [...(locality.value), val]
    } else {
      selected = locality.value.filter((v) => v !== val)
    }

    onChangeFilter('locality', { value: selected })
  }

  return (
    <FlexContainer 
      isFlexColumn className={`el-mx2 el-p3 ${styles.filterItem}`}
    >
      <div className="el-fs-6 el-mb3 el-white-text">
        Locality
      </div>
      <FlexContainer className="el-fs-8 el-my-auto">
        {locality.options.map((opt) => (
          <FlexContainer key={opt.value} className="el-mx4">
            <div className="el-mr2">
              <input type="checkbox" name={opt.value} className={`el-input ${styles.checkbox}`} 
                style={{border: 'solid 1px #ccc'}}
                value={opt.value} checked={locality.value.includes(opt.value)} 
                onChange={() => changeLocalityFilter(opt.value)} 
                onClick={(ev) => ev.stopPropagation()} />
            </div>
            <p style={{ lineHeight: 1.5 }} className="el-white-text">
              {opt.label}
            </p>
          </FlexContainer>
        ))}
      </FlexContainer>
    </FlexContainer>
  )
}

type BedroomsFilterViewProps = {
  bedrooms: NoMaxLimitRangeFilter
  onChangeFilter: ChangeFilterFunc
}

function BedroomsFilterView({ bedrooms, onChangeFilter }: BedroomsFilterViewProps) {
  function changeBedroomsFilter(val: { from?: string, to?: string}) {
    const newVal: {
      from?: number
      to?: number
    } = {}
    val.from && (newVal.from = parseInt(val.from))
    val.to && (newVal.to = parseInt(val.to) || Infinity)

    onChangeFilter('bedrooms', newVal)
  }

  return (
    <div className={`el-mx2 el-p3 ${styles.filterItem}`}>
      <div className="el-fs-6 el-mb3 el-white-text">
        Bedrooms
      </div>
      <FlexContainer className="el-fs-8 el-mb2">
        <div className="el-flex-grow el-mr4">
          <div className="el-mb2 el-fs-9 el-white-text">Min</div>
          <Select 
            value={bedrooms.from} 
            onChange={(ev) => changeBedroomsFilter({ from: ev.target.value })}
            className="el-w-full"
          >
            {range(bedrooms.min, bedrooms.max + 1).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </div>
        <div className="el-flex-grow">
          <div className="el-mb2 el-fs-9 el-white-text">Max</div>
          <Select 
            value={bedrooms.to} 
            onChange={(ev) => changeBedroomsFilter({ to: ev.target.value })}
            className="el-w-full"
          >
            {range(bedrooms.min, bedrooms.max + 1).map((opt) => (
              <option 
                key={opt} 
                value={opt !== bedrooms.max ? opt : Infinity}
              >{opt !== bedrooms.max ? opt : opt+'+'}</option>
            ))}
          </Select>
        </div>
      </FlexContainer>
    </div>
  )
}

type BathroomsFilterViewProps = {
  bathrooms: NoMaxLimitRangeFilter
  onChangeFilter: ChangeFilterFunc
}

function BathroomsFilterView({ bathrooms, onChangeFilter }: BathroomsFilterViewProps) {
  function changeBathroomsFilter(val: { from?: string, to?: string}) {
    const newVal: {
      from?: number
      to?: number
    } = {}
    val.from && (newVal.from = parseInt(val.from))
    val.to && (newVal.to = parseInt(val.to) || Infinity)

    onChangeFilter('bathrooms', newVal)
  }

  return (
    <div className={`el-flex-grow el-ml2 el-p3 ${styles.filterItem}`}>
      <div className="el-fs-6 el-mb3 el-white-text">
        Bathrooms
      </div>
      <FlexContainer className="el-fs-8 el-mb2">
        <div className="el-flex-grow el-mr4">
          <div className="el-mb2 el-fs-9 el-white-text">Min</div>
          <Select 
            value={bathrooms.from} 
            onChange={(ev) => changeBathroomsFilter({ from: ev.target.value })}
            className="el-w-full"
          >
            {range(bathrooms.min, bathrooms.max + 1).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </div>
        <div className="el-flex-grow">
          <div className="el-mb2 el-fs-9 el-white-text">Max</div>
          <Select 
            value={bathrooms.to} 
            onChange={(ev) => changeBathroomsFilter({ to: ev.target.value })}
            className="el-w-full"
          >
            {range(bathrooms.min, bathrooms.max + 1).map((opt) => (
              <option 
                key={opt} 
                value={opt !== bathrooms.max ? opt : Infinity}
              >{opt !== bathrooms.max ? opt : opt+'+'}</option>
            ))}
          </Select>
        </div>
      </FlexContainer>
    </div>
  )
}

export default PropertyFilter