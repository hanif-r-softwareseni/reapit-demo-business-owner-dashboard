import React, { useState, HTMLAttributes, forwardRef, useImperativeHandle, useRef, KeyboardEvent } from 'react'
import { styled } from '@linaria/react'
import { css } from '@linaria/core'
import profilePictureImage from 'assets/images/mehrad-profile-picture.jpg'
import dayjs from 'dayjs'
import { space, fontSize } from 'constants/theme'
import { FlexContainer } from '@reapit/elements'
import Textarea from './textarea'
import Button from './button'

export type Message = {
  message: string
  memberName: string
  you: boolean
  timestamp: Date
}

export type ChatRoom = {
  id: string,
  member: string
  latestMessage: string
  timestamp: Date
  messages: Message[]
}

export type Methods = {
  scrollToEnd: () => void
}

interface Props extends HTMLAttributes<HTMLElement> {
  chatRoom: ChatRoom | undefined
  onSend?: (text: string) => void
}

export const ChatRoomSection = forwardRef<Methods, Props>(({ chatRoom, onSend, ...rest }, ref) => {
  const [ready, setReady] = useState(false)
  const [inputHeight, setInputHeight] = useState(0)
  const [enteredMessage, setEnteredMessage] = useState('')
  const scrollableBody = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    scrollToEnd: scrollToEnd
  }))

  function sendMessage() {
    onSend && onSend(enteredMessage)
    setEnteredMessage('')
  }

  function scrollToEnd() {
    if (!scrollableBody.current) return
    const el = scrollableBody.current
    el.scrollTop = el.scrollHeight - el.clientHeight
  }

  function onInputHeightChange(height: number) {
    setInputHeight(height)
    setReady(true)
  }

  function getScrollableBodyContentHeight(): string {
    if (!ready) {
      return '250px'
    }
    return `calc(100% - (${inputHeight}px + 2 * ${inputPadding} + 2 * ${MessageInputBottomSpace}))`
  }

  function onEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
      return
    }
    if (e.key === 'Enter') {
      sendMessage()
      e.preventDefault()
    }
  }

  if (chatRoom === undefined) return (<></>)

  return (
    <StyledChatRoomSection {...rest} style={{ display: ready ? 'block' : 'none'}}>
      <ChatRoomSectionHeader>
        <ProfileImage src={profilePictureImage} />
        <ChatRoomName>{chatRoom.member}</ChatRoomName>
      </ChatRoomSectionHeader>
      <ChatRoomSectionBody>
        <ScrollableBodyContent style={{ height: getScrollableBodyContentHeight()}} ref={scrollableBody}>
          {chatRoom.messages.map((msg, index) => (
            <FlexContainer key={index} isFlexJustifyStart={!msg.you} isFlexJustifyEnd={msg.you}>
              <BaseMessage className={msg.you ? SendMessage : ReceivedMessage}>
                <MessageContent>{msg.message}</MessageContent>
                <MessageTimestamp>{dayjs(msg.timestamp).format('M/D/YY hh:mm A')}</MessageTimestamp>
              </BaseMessage>
            </FlexContainer>
          ))}
        </ScrollableBodyContent>
        <MessageInputContainer>
          <StyledTextarea placeholder="Type message here..." maxRows={5} onHeightChange={onInputHeightChange}
            value={enteredMessage} onChange={(e) => setEnteredMessage(e.target.value)} onKeyDown={onEnter} />
          <Button onClick={sendMessage} intent="primary">Send</Button>
        </MessageInputContainer>
        <div style={{ padding: MessageInputBottomSpace }}></div>
      </ChatRoomSectionBody>
    </StyledChatRoomSection>
  )
})

const chatRoomSectionHeaderHeight = '76px'
const inputPadding = space[4]
const MessageInputBottomSpace = space[2]

const StyledChatRoomSection = styled.div`
  width: 70%;
  height: 100%;
  border-left: 1px solid #ccc;
  display: none;
`

const ChatRoomSectionHeader = styled.div`
  height: ${chatRoomSectionHeaderHeight};
  display: flex;
  align-items: center;
  padding: ${space[2]};
  border-bottom: 1px solid #ccc;
`

const ChatRoomSectionBody = styled.div`
  height: calc(100% - (${chatRoomSectionHeaderHeight}));
`

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin: ${space[2]};
`

const ChatRoomName = styled.div`
  font-size: ${fontSize[6]};
  margin: ${space[2]};
`
const MessageTimestamp = styled.div`
  font-size: ${fontSize[9]};
  padding: ${space[2]};
  text-align: right;
`

const SendMessage = css`
  background-color: #0061A8;
  color: white;
  border-radius: 12px 12px 0 12px;

  ${MessageTimestamp} {
    color: white;
  }
`
const ReceivedMessage = css`
  background-color: white;
  color: black;
  border-radius: 12px 12px 12px 0;
  border: 1px solid #aaa;

  ${MessageTimestamp} {
    color: #606060;
  }
`
const BaseMessage = styled.div`
  margin: ${space[4]};
  padding: ${space[2]};
  max-width: 80%;
  font-size: ${fontSize[7]};
`

const MessageContent = styled.p`
  padding: ${space[2]};
  white-space: pre-line;
`

const ScrollableBodyContent = styled.div`
  overflow-y: scroll;
  min-width: 200px;
  padding: ${space[2]};
`

const MessageInputContainer = styled.div`
  padding: ${inputPadding};
  border-top: 1px solid #ccc;
  display: flex;
  align-items: center;
`

const StyledTextarea = styled(Textarea)`
  margin-right: ${space[4]}
`

export default ChatRoomSection
