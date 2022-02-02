import { styled } from '@linaria/react'

export const mainHeaderHeight = '60px'

export const StyledMainHeader = styled.div`
  height: ${mainHeaderHeight};
  display: flex;
  justify-content: end;
  background-color: var(--color-white);
  border-bottom: 1px solid #ccc;
`
export const AvatarImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
`

export const AvatarImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
`
