import React, { useState, FC, useEffect, useRef } from 'react'
import Filter, { FilterOptions } from './filter'
import { QueryParams } from 'platform-api/properties-api'

type Props = {
  onApply: (queryParams: QueryParams) => void
  onFilterChange?: (filter: FilterOptions) => void
}

export const PropertyFilter: FC<Props> = ({onApply, onFilterChange=() => {}}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    price: {
      type: 'number',
      displayName: 'Price',
      active: false,
      operatorOptions: ['equalTo', 'between', 'greaterThanEqual', 'lessThanEqual'],
      selectedOperator: 'equalTo',
      value1: '',
      value2: '',
    },
    type: {
      type: 'multipleChoices',
      displayName: 'Type',
      active: false,
      options: [
        { label: 'House', value: 'house'},
        { label: 'Bungalow', value: 'bungalow' },
        { label: 'Flat Apartment', value: 'flatApartment'},
        { label: 'Maisonette', value: 'maisonette' },
        { label: 'Land', value: 'land' },
        { label: 'Farm', value: 'farm' },
        { label: 'Cottage', value: 'cottage' },
        { label: 'Studio', value: 'studio' },
        { label: 'Townhouse', value: 'townhouse' },
      ],
      selectedOptions: []
    },
    bedrooms: {
      type: 'number',
      displayName: 'Bedrooms',
      active: false,
      operatorOptions: ['equalTo', 'between', 'greaterThanEqual', 'lessThanEqual'],
      selectedOperator: 'equalTo',
      value1: '',
      value2: '',
    },
    locality: {
      type: 'multipleChoices',
      displayName: 'Locality',
      active: false,
      options: [
        { label: 'Rural', value: 'rural'},
        { label: 'Village', value: 'village' },
        { label: 'Town/City', value: 'townCity'},
      ],
      selectedOptions: []
    }
  })
  const previousQueryParams = useRef<QueryParams>({})

  useEffect(() => {
    onFilterChange(filterOptions)
  }, [filterOptions])

  function apply() {
    doApply(getQueryParams())
  }

  function getQueryParams() {
    return Object.entries(filterOptions).reduce((queryParams, [name, opt]) => {
      if (!opt.active) return queryParams
      
      if (opt.type === 'number') {
        if (opt.selectedOperator === 'equalTo') {
          queryParams[`${name}From`] = opt.value1
          queryParams[`${name}To`] = opt.value1
        }
        if (opt.selectedOperator === 'between') {
          queryParams[`${name}From`] = opt.value1
          queryParams[`${name}To`] = opt.value2
        }
        if (opt.selectedOperator === 'greaterThanEqual') {
          queryParams[`${name}From`] = opt.value1
        }
        if (opt.selectedOperator === 'lessThanEqual') {
          queryParams[`${name}To`] = opt.value1
        }
      }

      if (opt.type === 'search') {
        queryParams[`${name}`] = opt.searchQuery
      }

      if (opt.type === 'multipleChoices') {
        queryParams[`${name}`] = opt.selectedOptions
      }

      return queryParams
    }, {} as QueryParams)
  }

  function clear(filter: FilterOptions) {
    setFilterOptions(filter)
    doApply({})
  }

  function doApply(queryParams: QueryParams) {
    if (JSON.stringify(queryParams) === JSON.stringify(previousQueryParams.current)) return
    previousQueryParams.current = queryParams
    onApply(queryParams)
  }
  
  return (
    <Filter filter={filterOptions} crossAxisOffset={20} onFilterChange={setFilterOptions}
      onApply={apply} onClear={clear} />
  )
}

export default PropertyFilter