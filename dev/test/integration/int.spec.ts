import type { Payload } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import { PageSpeedStrategies } from '../../../src/utilities/pageSpeedStrategies.js'
import { insightsSlug, reportsSlug } from '../../helpers/defaults.js'
import { seed } from '../../seed.js'
import { fetchPluginEndpoint } from './fetchPluginEndpoint.js'

let payload: Payload

/**
 * TODO: Better test coverage
 */
describe('Plugin integration tests', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (payload) {
      await payload.destroy()
    }
  })

  beforeEach(async () => {
    await seed(payload, true)
  })

  describe('endpoint', () => {
    test('should return error if no api key provided in config', async () => {
      const response = await fetchPluginEndpoint({ apiKey: '', payload })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toMatchObject({
        message: 'No matched field found for "apiKey"',
      })
    })

    test('should return unauthorized if request does not have read and create access', async () => {
      const response = await fetchPluginEndpoint({
        apiKey: 'fake-api-key',
        payload,
        unauthenticated: true,
      })
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toMatchObject({
        message: 'You are not allowed to perform this action.',
      })
    })

    test('should create report doc in endpoint', async () => {
      const insightsDoc = await payload.create({
        collection: insightsSlug,
        data: {
          url: 'http://localhost:3000',
        },
        depth: 0,
      })

      expect(insightsDoc).toBeTruthy()
      expect(insightsDoc.report).toEqual(undefined)

      const response = await fetchPluginEndpoint({ docId: insightsDoc.id, payload })

      expect(response.status).toBe(200)

      const updatedDoc = await payload.findByID({
        id: insightsDoc.id,
        collection: insightsSlug,
        depth: 0,
      })

      expect(updatedDoc.report).toBeTruthy()
    })

    test('should return existing report doc if one exists in insight doc', async () => {
      const insightsDoc = await payload.create({
        collection: insightsSlug,
        data: {
          url: 'http://localhost:3000',
        },
        depth: 0,
      })

      expect(insightsDoc).toBeTruthy()

      const response = await fetchPluginEndpoint({ docId: insightsDoc.id, payload })

      expect(response.status).toBe(200)

      const updatedDoc = await payload.findByID({
        id: insightsDoc.id,
        collection: insightsSlug,
        depth: 0,
      })

      const duplicateResponse = await fetchPluginEndpoint({ docId: insightsDoc.id, payload })
      expect(duplicateResponse.status).toBe(200)
      const { report: reportFromApi } = await duplicateResponse.json()

      expect(reportFromApi).toBe(updatedDoc.report)
    })
  })

  describe('hooks', () => {
    test('should delete report doc when insight counterpart doc is deleted', async () => {
      const {
        docs: [insightDoc],
      } = await payload.find({
        collection: insightsSlug,
        depth: 0,
        limit: 1,
        where: {
          title: {
            equals: 'Seeded by plugin',
          },
        },
      })

      expect(insightDoc).toBeTruthy()
      expect(insightDoc.report).toBeTruthy()

      const reportDocId = insightDoc.report

      const reportDoc = await payload.findByID({
        id: reportDocId as string,
        collection: reportsSlug,
        depth: 0,
      })

      expect(reportDoc).toBeTruthy()

      await payload.delete({
        id: insightDoc.id,
        collection: insightsSlug,
        depth: 0,
      })

      const { docs: reportDocsAfterDelete } = await payload.find({
        collection: reportsSlug,
        depth: 0,
        limit: 1,
        where: {
          id: {
            equals: reportDocId,
          },
        },
      })

      expect(reportDocsAfterDelete).toHaveLength(0)
    })

    test('should populate insights doc title', async () => {
      const url = 'http://localhost:3000'
      const strategy = PageSpeedStrategies.MOBILE

      const insightsDoc = await payload.create({
        collection: insightsSlug,
        data: {
          strategy: strategy.value,
          url,
        },
        depth: 0,
        select: { title: true },
      })

      expect(insightsDoc.title).toEqual(`${url} - ${strategy.label}`)
    })
  })
})
