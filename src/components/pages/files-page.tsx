import React, { useCallback, useState } from 'react'
import { PageContainer, Title, Modal, BodyText, FlexContainer } from '@reapit/elements'
import { Button } from 'components/ui'
import { useDropzone } from 'react-dropzone'
import { styled } from '@linaria/react'
import { fontSize, space } from 'constants/theme'
import EditTagsModal from 'components/ui/edit-tags-modal'
import ChipList, { Value as Tag, Category } from 'components/ui/chip-list'

type FileRowData = {
  name: string
  tags: Tag[]
}

export const FilesPage = () => {
  const [fileRowDataList, setFileRowDataList] = useState<FileRowData[]>([])
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)
  const [categories] = useState<Category[]>([
    {
      name: 'agent',
      label: 'Agent',
      backgrounColor: '#303f9f',
      textColor: 'white',
    },
    {
      name: 'client',
      label: 'Client',
      backgrounColor: '#c2185b',
      textColor: 'white',
    },
    {
      name: 'property',
      label: 'Property',
      backgrounColor: '#2e7d32',
      textColor: 'white',
    }
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileRowDataList(acceptedFiles.map((f) => ({
      name: f.name,
      tags: [],
    })))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  function copyToClipboard() {
    navigator.clipboard.writeText('http://example.com/lsdkfjlsklsked')
  }

  function applyTags(name: string, tags: Tag[]) {
    const newFileRowDataList = fileRowDataList.map((dat) => {
      if (dat.name === name) {
        return {
          ...dat,
          tags: tags,
        }
      }
      return dat
    })

    setFileRowDataList(newFileRowDataList)
    setEditTagsModalIsOpen(false)
  }

  return (
  <PageContainer>
    <Title>Files</Title>
    <DropZone {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <DropZoneText>Drop the files here ...</DropZoneText> :
          <DropZoneText>{'Drag & drop some files here, or click to select files'}</DropZoneText>
      }
    </DropZone>
    <div className="el-section-title-text el-mb4">Uploaded Files</div>
    {fileRowDataList.map((file) => (
      <FileRow key={file.name}>
        <FileRowLeft>
          <div>{file.name}</div>
          <ChipList value={file.tags} categories={categories} />
        </FileRowLeft>
        <FileRowRight>
          <Button intent="primary" className="el-mx2" onClick={() => setEditTagsModalIsOpen(true)}>Edit Tags</Button>
          <Button intent="primary" className="el-mx2">Export to pdf</Button>
          <Button intent="primary" className="el-mx2" onClick={() => setShareModalIsOpen(true)}>Share</Button>
          
          <Modal isOpen={shareModalIsOpen} onModalClose={() => setShareModalIsOpen(false)} title="Share Link">
            <BodyText>
              <FlexContainer>
                <ShareModalTextInner>http://example.com/lsdkfjlsklsked</ShareModalTextInner>
                <Button intent="primary" onClick={copyToClipboard}>Copy</Button>
              </FlexContainer>
            </BodyText>
          </Modal>
          <EditTagsModal name={file.name} selected={file.tags} categories={categories} 
            isOpen={editTagsModalIsOpen} onModalClose={() => setEditTagsModalIsOpen(false)} 
            onApply={(tags: Tag[]) => applyTags(file.name, tags)} />
        </FileRowRight>
      </FileRow>
    ))}
  </PageContainer>)
}

const DropZone = styled.div`
  height: 100px;
  background-color: rgb(236, 236, 236);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${space[4]};
`

const DropZoneText = styled.div`
  font-size: ${fontSize[6]};
  color: #808080;
`
const FileRow = styled.div`
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
`

const FileRowLeft = styled.div`
  padding: ${space[5]};
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-size: ${fontSize[7]};
`

const FileRowRight = styled.div`
  padding: ${space[3]};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
`

const ShareModalTextInner = styled.div`
  border: 1px solid #ccc;
  padding: ${space[3]};
  margin-right: ${space[3]};
`

export default FilesPage