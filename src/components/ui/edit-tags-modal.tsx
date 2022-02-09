import React, { useState, FC, useEffect } from 'react'
import { FlexContainer, Modal } from '@reapit/elements'
import ChipList, { Value as Tag, Category} from './chip-list'
import Input from './input'
import { styled } from '@linaria/react'
import { fontSize, space } from 'constants/theme'
import { Button } from './button'

type SearchResult = {
  name: string
  label: string
  categoryName: string
  categoryLabel: string
} 

type Props = {
  name: string
  selected: Tag[]
  isOpen: boolean
  onModalClose: () => void
  onApply?: (selected: Tag[]) => void
  categories?: Category[]
}

export const EditTagsModal: FC<Props> = ({ name, selected, isOpen, onModalClose, categories, onApply }) => {
  const [selectedDraft, setSelectedDraft] = useState<Tag[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (isOpen) {
      setSelectedDraft(selected)
      setSearchValue('')
    }
  }, [isOpen])

  useEffect(() => {
    updateSearchResults(searchValue)
  }, [searchValue])

  function updateSearchResults(value: string) {
    if (value === '') {
      setSearchResults([])
      return
    }

    let results = dummyData.filter((d) => d.name.toLowerCase().includes(value.toLowerCase()))
    results = results || []
    const theSearchResults: SearchResult[] = results.map((res) => {
      return {
        name: res.name,
        label: res.name,
        categoryName: res.category,
        categoryLabel: categories?.find((c) => c.name === res.category)?.label || ''
      }
    })
    setSearchResults(theSearchResults)
  }

  function onSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchValue(value)
  }

  function addTag(res: SearchResult) {
    const foundTag = selectedDraft.find((t) => t.name === res.name && t.category === res.categoryName)
    if (foundTag) {
      return
    }

    setSelectedDraft([...selectedDraft, {
      name: res.name,
      label: res.label,
      category: res.categoryName,
    }])
  }

  function removeTag(tag: Tag) {
    setSelectedDraft(selectedDraft.filter((item) => item.name !== tag.name || item.category !== tag.category))
  }

  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose} title={`Edit tags for ${name}`} style={{height: '65vh'}}>
      <div className="el-fs-6 el-mb4">Applied Tags</div>
      {selectedDraft.length > 0 ? (
        <ChipList value={selectedDraft} className="el-mb4" style={{ backgroundColor: '#f1f1f1' }}
          categories={categories} onDelete={removeTag}>
        </ChipList>
      ) : (
        <NoTags className="el-mb4">
          No Tags
        </NoTags>
      )}
      <div className="el-fs-6 el-mb4">Search Tags</div>
      <Input placeholder="Search agents, clients, and properties" value={searchValue}
        onChange={onSearchInputChange} className="el-w-full" />
      <div className="el-mb3"></div>
      {searchResults.map((res, index) => (
        <SearchResultItem key={index} onClick={() => addTag(res)}>
          <SearchResultItemTag>
            {res.label}
          </SearchResultItemTag>
          <SearchResultItemCategory>
            {res.categoryLabel}
          </SearchResultItemCategory>
        </SearchResultItem>
      ))}
      <FlexContainer isFlexJustifyEnd className="el-p4">
        <Button intent="primary" onClick={() => onApply && onApply(selectedDraft)}>Apply</Button>
      </FlexContainer>
    </Modal>
  )
}

const SearchResultItem = styled.div`
  padding: ${space[3]};
  border: 1px solid #ccc;
  display: flex;
`

const SearchResultItemTag = styled.div`
  margin-right: ${space[3]};
`

const SearchResultItemCategory = styled.div`
  color: #808080;
`

const NoTags = styled.div`
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  font-size: ${fontSize[6]};
  color: #808080;
`

const dummyData = [
  {
    name: 'John Doe',
    category: 'agent',
  },
  {
    name: 'Adam Smith',
    category: 'agent',
  },
  {
    name: 'John Smith',
    category: 'client',
  },
  {
    name: 'Adam Doe',
    category: 'client',
  },
  {
    name: 'Cal Jaden',
    category: 'client',
  },
  {
    name: 'MKT-123456',
    category: 'property'
  },
  {
    name: 'JDE-345789',
    category: 'property',
  }
]

export default EditTagsModal