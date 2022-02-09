import { ReapitConnectSession } from '@reapit/connect-session'
import { NegotiatorModelPagedResult, Negotiators } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'
import { toQueryString } from 'utils/query-params'

export type QueryParams = Negotiators

export const negotiatorsApiService = async (
  session: ReapitConnectSession | null,
  queryParams?: QueryParams,
): Promise<NegotiatorModelPagedResult | undefined> => {
  try {
    if (!session) return

    const url = `${window.reapit.config.platformApiUrl}${URLS.NEGOTIATORS}`
    + `?${toQueryString(queryParams as Record<string, string>)}`

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (response) {
      const responseJson: Promise<NegotiatorModelPagedResult | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    console.error('Error fetching Negotiators', err)
  }
}