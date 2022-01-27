import { propertiesApiService } from '../properties-api'
import { PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { mockBrowserSession } from '../__mocks__/session'

const mockedFetch = jest.spyOn(window, 'fetch')
const mockProperties = {
  _embedded: [
    {
      selling: {
        price: 100,
        recommendedPrice: 200,
      },
      address: {
        buildingNumber: '123',
        line1: 'line 1',
        line2: 'line 2',
        line3: 'line 3',
        line4: 'line 4',
        postcode: '12345',
      },
      bedrooms: 2,
      bathrooms: 3,
      type: ['house', 'land'],
      summary: 'this is summary',
    },
  ],
  pageNumber: 1,
  pageSize: 5,
  pageCount: 10,
  totalPageCount: 50,
  totalCount: 100,
  _links: {
    aName: {
      href: 'http://example.com',
    },
  },
} as PropertyModelPagedResult

describe('propertiesApiService', () => {
  it('should return a response from the properties service', async () => {
    mockedFetch.mockReturnValueOnce({ json: jest.fn(() => mockProperties) } as any)
    expect(await propertiesApiService(mockBrowserSession)).toEqual(mockProperties)
    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })
})
