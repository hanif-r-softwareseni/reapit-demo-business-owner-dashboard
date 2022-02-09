import { ReapitConnectSession } from '@reapit/connect-session'
import { ApplicantModelPagedResult, Applicants } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'
import { toQueryString } from 'utils/query-params'

export type QueryParams = Applicants

export const applicantsApiService = async (
  session: ReapitConnectSession | null,
  queryParams?: QueryParams,
): Promise<ApplicantModelPagedResult | undefined> => {
  try {
    if (!session) return

    const url = `${window.reapit.config.platformApiUrl}${URLS.APPLICANTS}`
    + `?${toQueryString(queryParams as Record<string, string>)}`

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (response) {
      const responseJson: Promise<ApplicantModelPagedResult | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    console.error('Error fetching Applicants', err)
  }
}