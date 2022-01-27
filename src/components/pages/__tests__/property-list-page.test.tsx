import React from 'react'
import { render } from '@testing-library/react'
import PropertyList from '../properties-page'

describe('PropertyList', () => {
  it('should match a snapshot', () => {
    expect(render(<PropertyList />)).toMatchSnapshot()
  })
})
