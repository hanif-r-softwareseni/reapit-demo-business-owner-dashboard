import React, { useState, FC, useRef, useLayoutEffect } from 'react'
import { FlexContainer, Select } from '@reapit/elements'
import { useFloating, shift, offset } from '@floating-ui/react-dom'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from './button'
import Icon from './icon'
import styles from './filter.module.scss'

type NumberFilterOption = {
  type: 'number'
  displayName: string
  active: boolean
  operatorOptions: ('equalTo' | 'between' | 'greaterThanEqual' | 'lessThanEqual')[] 
  selectedOperator: 'equalTo' | 'between' | 'greaterThanEqual' | 'lessThanEqual'
  value1: string
  value2: string
}

type SearchFilterOption = {
  type: 'search'
  displayName: string
  active: boolean
  searchQuery: string
}

type MultipleChoicesFilterOption = {
  type: 'multipleChoices'
  displayName: string
  active: boolean
  selectedOptions: string[]
  options: {
    value: string
    label: string
  }[]
}

type FilterOption = NumberFilterOption | SearchFilterOption | MultipleChoicesFilterOption

export type FilterOptions = {
  [name: string]: FilterOption
}

type ChangeFilterOption = (name: string, opt: Partial<FilterOption>) => void

type Props = {
  filter: FilterOptions
  crossAxisOffset?: number
  onFilterChange?: (filter: FilterOptions) => void
  onApply: () => void
  onClear: (filter: FilterOptions) => void
}

export const Filter: FC<Props> = ({ 
  filter: filterOpts, crossAxisOffset = 0,
  onFilterChange, onApply, onClear
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [expanded, setExpanded] = React.useState('')
  const filterEl = useRef<HTMLDivElement | null>(null)
  const [appliedFilterCount, setAppliedFilterCount] = useState(0)

  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'bottom',
    middleware: [shift(), offset({
      mainAxis: 2,
      crossAxis: crossAxisOffset,
    })],
  })

  useLayoutEffect(() => {
    floating(filterEl.current)
  }, [filterEl])

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '')
  }

  function toggleActive(name: string) {
    const newFilterOpt = {...filterOpts[name], active: !filterOpts[name].active}
    const newFilterOpts = {...filterOpts, [name]: newFilterOpt}
    onFilterChange && onFilterChange(newFilterOpts)
  }

  function changeFilterOption(name: string, opt: Partial<FilterOption>) {
    const newFilterOpts = { ...filterOpts }
    newFilterOpts[name] = { ...newFilterOpts[name], ...(opt as FilterOption) }
    onFilterChange && onFilterChange(newFilterOpts)
  }

  function apply() {
    onApply()
    setAppliedFilterCount(activeFilterCount())
    setIsFilterVisible(false)
  }

  function clear() {
    onClear(Object.entries(filterOpts).reduce((result, [name, opt]) => {
      const newOpt = { ...opt } as FilterOption
      newOpt.active = false
      'value1' in newOpt && (newOpt.value1 = '')
      'value2' in newOpt && (newOpt.value2 = '')
      'searchQuery' in newOpt && (newOpt.searchQuery = '')
      'selectedOptions' in newOpt && (newOpt.selectedOptions = [])
      'selectedOperator' in newOpt && (newOpt.selectedOperator = newOpt.operatorOptions[0])
      result[name] = newOpt
      return result
    }, {}))
    setAppliedFilterCount(0)
    setIsFilterVisible(false)
  }

  function activeFilterCount() {
    return Object.values(filterOpts).reduce((count, opt) => count + (opt.active ? 1 : 0), 0)
  }

  function toggleFilterView() {
    setIsFilterVisible(!isFilterVisible)

    if (isFilterVisible) return
    setTimeout(() => {
      const listener = (event: MouseEvent) => {
        document.removeEventListener('click', listener)
        if (filterEl.current === null) return
        if (!filterEl.current.contains(event.target as Node)) {
          setIsFilterVisible(false)
        }
      }
      document.addEventListener('click', listener, false)
    }, 50)
    
  }

  return (
    <div style={{position: 'relative'}}>
      <Button ref={reference} intent="neutral" onClick={toggleFilterView}>
        Filter {appliedFilterCount > 0 && '| ' + appliedFilterCount}
      </Button>
      {isFilterVisible && (
        <div 
          ref={filterEl}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            backgroundColor: 'white',
          }} 
          className={`el-border-radius el-border-blue ${styles.card}`}
        >
          <FlexContainer isFlexJustifyEnd className="el-border-grey-b el-p4">
            <Button onClick={clear} intent="low">Clear</Button>
            <Button onClick={apply} intent="primary" className="el-ml4">Apply</Button>
          </FlexContainer>
          {Object.entries(filterOpts).map(([name, opt]) => (
            <Accordion key={name} expanded={expanded === name} onChange={handleChange(name)} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FlexContainer>
                  <div className="el-mr6">
                    <input type="checkbox" name={name} className="el-input" style={{border: 'solid 1px #ccc'}}
                      value={name} checked={opt.active} onChange={() => toggleActive(name)} 
                      onClick={(ev) => ev.stopPropagation()} />
                  </div>
                  <p>
                    {opt.displayName}
                  </p>
                </FlexContainer> 
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                {opt.type === 'number' && (
                  <NumberFilter name={name} opt={opt} onChangeFilterOption={changeFilterOption} />
                )}
                {opt.type === 'multipleChoices' && (
                  <MultipleChoicesFilter name={name} opt={opt} onChangeFilterOption={changeFilterOption} />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  )
}

type NumberFilterProps = {
  name: string
  opt: NumberFilterOption
  onChangeFilterOption: ChangeFilterOption
}

function NumberFilter({name, opt, onChangeFilterOption}: NumberFilterProps) {
  if (!opt.operatorOptions.includes(selectedOperator())) {
    throw new Error(`Selected operator "${selectedOperator()}" doesn't exist in operator options in filter option "${name}"`)
  }

  function changeOperator(op: NumberFilterOption['selectedOperator']) {
    onChangeFilterOption(name, { selectedOperator: op})
  }

  function changeValue1(val: NumberFilterOption['value1']) {
    onChangeFilterOption(name, { value1: val})
  }

  function changeValue2(val: NumberFilterOption['value2']) {
    onChangeFilterOption(name, { value2: val})
  }

  function selectedOperator() {
    return opt.selectedOperator
  }

  return (
    <>
      <FlexContainer className="el-mb6">
        <Select value={selectedOperator()} onChange={(ev) => changeOperator(ev.target.value as NumberFilterOption['selectedOperator'])}>
          {opt.operatorOptions.map((op) => (
            <option key={op} value={op}>{getLabel(op)}</option>
          ))}
        </Select>
      </FlexContainer>
      <FlexContainer className="el-mb3">
        <FlexContainer isFlexAlignCenter style={{ width: '32px' }}>
          <Icon asset="fontawesome" icon="long-arrow-alt-right" style={{ fontSize: '16px' }} />
        </FlexContainer>
        <div style={{ flexGrow: 1 }}>
          <input type="text" value={opt.value1} onChange={(ev) => changeValue1(ev.target.value)}
            className="el-input" style={{width: '100%'}} />
        </div>
      </FlexContainer>
      {selectedOperator() === 'between' && (
        <>
          <FlexContainer className="el-mb3">
            <div style={{ width: '32px' }}></div>
            <p>and</p>
          </FlexContainer>
          <FlexContainer className="el-mb3">
            <div style={{ width: '32px' }}></div>
            <div style={{ flexGrow: 1 }}>
              <div className="el-mb6">
                <input type="text" value={opt.value2}  onChange={(ev) => changeValue2(ev.target.value)}
                  className="el-input" style={{width: '100%'}} />
              </div>
            </div>
          </FlexContainer>
        </>
      )}
    </>
  )
}

type MultipleChoicesFilterProps = {
  name: string
  opt: MultipleChoicesFilterOption
  onChangeFilterOption: ChangeFilterOption
}

function MultipleChoicesFilter({name, opt, onChangeFilterOption}: MultipleChoicesFilterProps) {
  function toggleActive(choiceVal: string) {
    const exist = opt.selectedOptions.find((val) => val === choiceVal)

    let selectedOptions: string[] = []
    if (!exist) {
      selectedOptions = [...(opt.selectedOptions), choiceVal]
    } else {
      selectedOptions = opt.selectedOptions.filter((val) => val !== choiceVal)
    }

    const active = selectedOptions.length > 0
    onChangeFilterOption(name, { selectedOptions: selectedOptions, active: active})
  }

  return (
    <>
      {opt.options.map((choice) => (
        <FlexContainer key={choice.value} className="el-mb4">
          <div className="el-mr6">
            <input type="checkbox" name={choice.value} className="el-input" style={{border: 'solid 1px #ccc'}}
              value={choice.value} checked={opt.selectedOptions.includes(choice.value)} 
              onChange={() => toggleActive(choice.value)} 
              onClick={(ev) => ev.stopPropagation()} />
          </div>
          <p>
            {choice.label}
          </p>
      </FlexContainer> 
      ))}
    </>
  )
}

function getLabel(name) {
  const labelList = {
    equalTo: 'equal to',
    between: 'between',
    greaterThanEqual: 'greater than equal',
    lessThanEqual: 'less than equal',
  }
  if (labelList[name] === undefined) {
    return '<no label>'
  }
  return labelList[name]
}

export default Filter