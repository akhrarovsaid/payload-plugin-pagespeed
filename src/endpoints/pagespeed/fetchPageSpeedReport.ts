import type { PayloadRequest } from 'payload'

import type { PageSpeedReportObject } from '../../types/pagespeed.js'

import { DEFAULT_PAGESPEED_API_URL } from '../../utilities/defaults.js'

type Args = {
  apiKey: string
  queryString: string
  req: PayloadRequest
}

type Result = {
  message?: string
  report?: PageSpeedReportObject
  status: 'error' | 'success'
}

export type FetchPageSpeedReportFn = (args: Args) => Promise<Result>

export const fetchPageSpeedReport: FetchPageSpeedReportFn = async ({
  apiKey,
  queryString,
  req,
}) => {
  const apiUrl = `${DEFAULT_PAGESPEED_API_URL}?key=${apiKey}&${queryString}`
  const apiRes = await fetch(apiUrl)
  const body = await apiRes.json()

  if (!apiRes.ok) {
    const { message = req.t('error:unknown') } = body.error
    req.payload.logger.error(message)
    return {
      message,
      status: 'error',
    }
  }

  return {
    report: body as PageSpeedReportObject,
    status: 'success',
  }
}
