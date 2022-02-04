import React, { FC } from 'react'
import { ChatRoom } from './chat-room-section'
import { styled } from '@linaria/react'
import profilePictureImage from 'assets/images/mehrad-profile-picture.jpg'
import dayjs from 'dayjs'
import { space, fontSize } from 'constants/theme'
import { FlexContainer } from '@reapit/elements'

export type ChatRooms = ChatRoom[]

interface Props {
  chatRooms: ChatRooms
  selectedId: string | undefined
  onSelect?: (index: string) => void
}

export const ChatRoomListSection: FC<Props> = ({ chatRooms, selectedId, onSelect }) => {
  return (
    <StyledChatRoomListSection>
      {chatRooms.map((room) => (
        <ChatRoomListItem key={room.id} onClick={() => onSelect && onSelect(room.id)}
          className={`${room.id === selectedId ? 'selected' : ''}`}
        >
          <ChatRoomListItemLeft>
            <ProfileImage src={profilePictureImage} />
          </ChatRoomListItemLeft>
          <ChatRoomListItemRight>
            <FlexContainer isFlexJustifyBetween isFlexAlignCenter className="el-mb1">
              <ChatRoomName>
                {room.member}
              </ChatRoomName>
              <ChatRoomTimestamp>
                {dayjs(room.timestamp).isToday() && dayjs(room.timestamp).format('hh:mm A')}
                {dayjs(room.timestamp).isYesterday() && 'yesterday'}
                {(!(dayjs(room.timestamp).isToday()) && !(dayjs(room.timestamp).isYesterday())) &&
                  dayjs(room.timestamp).format('M/D/YY')}
              </ChatRoomTimestamp>
            </FlexContainer>
            <LatestMessage>
              {room.latestMessage}
            </LatestMessage>
          </ChatRoomListItemRight>
        </ChatRoomListItem>
      ))}
    </StyledChatRoomListSection>
  )
}

const profileImageSize = '56px'

const StyledChatRoomListSection = styled.div`
  width: 30%;
  height: 100%;
  overflow-y: scroll;
`

const ChatRoomListItem = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: ${space[4]};

  &.selected {
    background-color: #B5CEFF;
  }
`

const ProfileImage = styled.img`
  width: ${profileImageSize};
  height: ${profileImageSize};
  border-radius: 50%;
  object-fit: cover;
`

const ChatRoomName = styled.div`
  font-size: ${fontSize[6]};
`

const ChatRoomTimestamp = styled.div`
  font-size: ${fontSize[9]};
  color: #606060;
`

const ChatRoomListItemLeft = styled.div`
  display: flex;
  align-items: center;
  margin: ${space[2]};
  width: ${profileImageSize};
`

const ChatRoomListItemRight = styled.div`
  margin: ${space[2]};
  flex-grow: 1;
`

const LatestMessage = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  display: -webkit-box;
`

export default ChatRoomListSection
