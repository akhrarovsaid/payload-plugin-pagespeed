import type { Payload, PayloadRequest } from 'payload'

import config from '@payload-config'
import { createPayloadRequest } from 'payload'

import { fetchPageSpeedReport } from '../../../src/endpoints/pagespeed/fetchPageSpeedReport.js'
import { pageSpeedEndpointHandler } from '../../../src/endpoints/pagespeed/handler.js'
import { insightsSlug, reportsSlug } from '../../helpers/defaults.js'
import { pageSpeedPluginConfig } from '../../plugins.js'
import { getMockFetchReportFn } from '../mock/fetchReport.js'
import { login } from './login.js'

export async function fetchPluginEndpoint({
  apiKey = 'fake-api-key',
  docId,
  mockRequestFn = true,
  payload,
  req: reqFromProps,
  unauthenticated = false,
}: {
  apiKey?: string
  docId?: number | string
  mockRequestFn?: boolean
  payload: Payload
  req?: PayloadRequest
  unauthenticated?: boolean
}) {
  const { token } = unauthenticated ? {} : await login({ payload })
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
  const endpointURL = `${serverURL}/api/pagespeed-insights${typeof docId !== 'undefined' ? `/${docId}` : ''}/report`

  const request = new Request(endpointURL, {
    headers: unauthenticated
      ? {}
      : {
          Authorization: `Bearer ${token}`,
        },
    method: 'GET',
  })

  const req = reqFromProps ? reqFromProps : await createPayloadRequest({ config, request })

  if (typeof docId !== 'undefined') {
    req.routeParams = {
      ...req.routeParams,
      id: docId,
      collection: insightsSlug,
    }
  }

  return pageSpeedEndpointHandler({
    fetchReportFn: mockRequestFn
      ? getMockFetchReportFn({ filePath: './mock-report-desktop.json' })
      : fetchPageSpeedReport,
    insightsSlug,
    pluginConfig: { ...pageSpeedPluginConfig, apiKey },
    reportsSlug,
    req,
  })
}
