import type { Payload, PayloadRequest } from 'payload'

import config from '@payload-config'
import { devUser } from 'helpers/credentials.js'
import { createPayloadRequest, getPayload } from 'payload'
import { afterAll, beforeAll, /* beforeEach,  */ describe, expect, test } from 'vitest'

import { pageSpeedEndpointHandler } from '../../src/endpoints/pagespeed/handler.js'
import { insightsSlug, reportsSlug } from '../helpers/defaults.js'
import { getMockFetchReportFn } from './mock/fetchReport.js'

let payload: Payload

afterAll(async () => {
  await payload.destroy()
})

beforeAll(async () => {
  payload = await getPayload({ config })
})

/* beforeEach(async () => {
  // seed
}) */

describe('Plugin integration tests', () => {
  describe('endpoint', () => {
    test('should return error if no api key provided', async () => {
      const response = await fetchReportEndpoint({ mockRequestFn: false, payload })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toMatchObject({
        message: 'No matched field found for "apiKey"',
      })
    })

    test('should return unauthorized if request does not have read and create access', async () => {
      const response = await fetchReportEndpoint({ payload, unauthenticated: true })
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toMatchObject({
        message: 'You are not allowed to perform this action.',
      })
    })

    test.skip('should create report doc in endpoint', async () => {
      /* const insightsDoc = await payload.create({
        collection: insightsSlug,
        data: {
          url: 'http://localhost:3000',
        },
        depth: 0,
      })

      expect(insightsDoc.report).toEqual(undefined)

      const response = await fetchReportEndpoint({ docId: insightsDoc.id, payload })

      expect(response.status).toBe(200)

      const originalDoc = await payload.findByID({
        id: insightsDoc.id,
        collection: insightsSlug,
        depth: 0,
      })

      expect(originalDoc.report).not.toBe(undefined) */
    })

    test.skip('should return existing report doc if one exists in insight doc', async () => {
      /* const request = new Request('http://localhost:3000/api/my-plugin-endpoint', {
        method: 'GET',
      })

      const payloadRequest = await createPayloadRequest({ config, request })
      const response = await customEndpointHandler(payloadRequest)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toMatchObject({
        message: 'Hello from custom endpoint',
      }) */
    })
  })

  describe('hooks', () => {
    test.skip('should delete report doc when insight counterpart doc is deleted', async () => {
      /* expect(payload.collections['plugin-collection']).toBeDefined()

      const { docs } = await payload.find({ collection: 'plugin-collection' })

      expect(docs).toHaveLength(1) */
    })

    test.skip('should populate insights doc title', async () => {})
  })
})

async function login({ payload }: { payload: Payload }) {
  return payload.login({
    collection: 'users',
    data: { email: devUser.email, password: devUser.password },
  })
}

async function fetchReportEndpoint({
  docId,
  mockRequestFn = true,
  payload,
  req: reqFromProps,
  unauthenticated = false,
}: {
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

  return pageSpeedEndpointHandler({
    fetchReportFn: mockRequestFn
      ? getMockFetchReportFn({ filePath: './mock-report-desktop.json' })
      : undefined,
    insightsSlug,
    pluginConfig: { apiKey: '' },
    reportsSlug,
    req,
  })
}
