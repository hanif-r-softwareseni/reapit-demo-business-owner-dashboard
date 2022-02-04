import React, { useRef, useState } from 'react'
import { PageContainer, Title, FlexContainer } from '@reapit/elements'
import { ChatRoomListSection, ChatRooms } from 'components/ui/chat-room-list-section'
import { ChatRoomSection, Methods as ChatRoomSectionMethods } from 'components/ui/chat-room-section'
import ld from 'lodash'

export const MessagesPage = () => {
  const [chatRoomList, setChatRoomList] = useState<ChatRooms>(chatRoomListInitState)
  const [currentChatRoomId, setCurrentChatRoomId] = useState('1')
  const chatRoomSectionRef = useRef<ChatRoomSectionMethods>(null)

  function sendMessage(text: string) {
    const removedChatRooms = ld.remove(chatRoomList, (room) => room.id === currentChatRoomId)
    let newChatRoom = removedChatRooms[0]
    const newTimestamp = new Date()
    newChatRoom = {
      ...newChatRoom,
      latestMessage: text,
      timestamp: newTimestamp,
      messages: [...newChatRoom.messages, {
        memberName: 'Your Name',
        message: text,
        you: true,
        timestamp: newTimestamp,
      }]
    }
    setChatRoomList([newChatRoom, ...chatRoomList])
    setTimeout(() => {
      chatRoomSectionRef.current?.scrollToEnd()
    }, 10)
  }

  function getCurrentChatRoom() {
    return chatRoomList.find((room) => room.id === currentChatRoomId)
  }

  return (
    <PageContainer style={{ paddingBottom: 0 }}>
      <Title>Messages</Title>
      <FlexContainer style={{ height: 'calc(100% - (36px + 2.5rem))' }}>
        <ChatRoomListSection chatRooms={chatRoomList} onSelect={setCurrentChatRoomId}
          selectedId={currentChatRoomId} />
        <ChatRoomSection chatRoom={getCurrentChatRoom()} onSend={sendMessage}
          ref={chatRoomSectionRef} />
      </FlexContainer>
    </PageContainer>
  )
}

const chatRoomListInitState: ChatRooms = [
  {
    id: '1',
    member: 'John Doe',
    latestMessage: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    timestamp: new Date('2022-02-04 15:45'),
    messages: [
      {
        message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
        memberName: 'John Doe',
        you: false,
        timestamp: new Date('2022-02-04 15:45'),
      }
    ]
  },
  {
    id: '2',
    member: 'Adam Smith',
    latestMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    timestamp: new Date('2022-02-03 15:45'),
    messages: [
      {
        message: 'Nunc rhoncus velit sit amet elementum tempor',
        memberName: 'Adam Smith',
        you: false,
        timestamp: new Date('2022-02-03 16:30'),
      },
      {
        message: 'Morbi eget lorem ut orci fermentum mollis',
        memberName: 'Your Name',
        you: true,
        timestamp: new Date('2022-02-03 16:32'),
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        memberName: 'Adam Smith',
        you: false,
        timestamp: new Date('2022-02-03 16:34'),
      },
    ]
  },
  {
    id: '3',
    member: 'John A',
    latestMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    timestamp: new Date('2022-01-28 10:20'),
    messages: [
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        memberName: 'John A',
        you: false,
        timestamp: new Date('2022-01-28 10:20'),
      }
    ]
  },
]

export default MessagesPage