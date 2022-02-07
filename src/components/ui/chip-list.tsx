import { styled } from '@linaria/react'
import { fontSize, space } from 'constants/theme'
import React, { CSSProperties, FC } from 'react'
import Icon from './icon'

export type Value = {
  name: string
  label: string
  category: string
}

export type Category = {
  name: string
  label: string
  backgrounColor: string
  textColor: string
}

type Props = {
  value: Value[]
  categories?: Category[]
  onDelete?: (val: Value) => void
  className?: string
  style?: CSSProperties
}

export const ChipList: FC<Props> = ({ value, categories = [], onDelete, className, style }) => {
  function chipStyle(categoryName: string): CSSProperties {
    const category = getCategory(categoryName)
    if (category === undefined) {
      return {}
    }

    return {
      backgroundColor: category.backgrounColor,
      color: category.textColor,
    }
  }

  function getCategory(name: string) {
    return categories.find((c) => c.name === name)
  }

  function CategoryText({ val }: { val: Value}) {
    const category = getCategory(val.category)
    if (category === undefined) {
      return (<></>)
    }

    return (
      <>
        <div style={{fontWeight: 'bold', padding: space[3], paddingRight: space[1]}}>
          {category.label}
        </div>
        <div style={{fontSize: '26px', color: 'white', fontWeight: 'bold'}}>-</div>
      </>
    )
  }

  return (
    <StyledChipList className={className} style={style}>
      {value.map((val) => (
        <Chip key={`${val.name}:${val.category}`} style={chipStyle(val.category)}>
          <CategoryText val={val} />
          <div 
            style={{
              fontWeight: 'bold', padding: `${space[3]}`, paddingRight: onDelete ? 0 : space[3],
              paddingLeft: getCategory(val.category) !== undefined ? space[1] : space[3]
            }}
          >
            {val.label}
          </div>
          {onDelete && (
            <div onClick={() => onDelete(val)} className="el-ml2" 
              style={{ padding: `${space[3]} ${space[3]} ${space[3]} 0` }}
            >
              <Icon asset="fontawesome" icon="times-circle" style={{ color: '#808080', fontSize: '15px' }} />
            </div>
          )}
        </Chip>
      ))}
    </StyledChipList>
  )
}

const StyledChipList = styled.div`
  display: flex;
  padding: ${space[2]};
`

const Chip = styled.div`
  margin: ${space[2]};
  border-radius: 8px;
  font-size: ${fontSize[9]};
  display: flex;
  align-items: center;
`

export default ChipList