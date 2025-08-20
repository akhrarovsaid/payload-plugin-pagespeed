import type { JsonObject, PayloadRequest } from 'payload'

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

  let body: JsonObject | undefined
  try {
    body = await apiRes.json()
  } catch {
    body = undefined
  }

  if (!apiRes.ok) {
    return {
      message: body?.message ?? req.t('error:unknown'),
      status: 'error',
    }
  }

  return {
    report: body as PageSpeedReportObject,
    status: 'success',
  }
}
