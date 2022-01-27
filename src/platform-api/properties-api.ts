import { ReapitConnectSession } from '@reapit/connect-session'
import { PropertyModelPagedResult, Properties } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'
import { toQueryString } from 'utils/query-params'

export type QueryParams = Properties

export const propertiesApiService = async (
  session: ReapitConnectSession | null,
  queryParams?: QueryParams,
): Promise<PropertyModelPagedResult | undefined> => {
  try {
    if (!session) return

    const url = `${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}`
    + `?${toQueryString(queryParams as Record<string, string>)}`

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (response) {
      const responseJson: Promise<PropertyModelPagedResult | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    console.error('Error fetching Properties', err)
  }
}
