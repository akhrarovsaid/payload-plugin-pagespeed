import {
  getAccessResults,
  headersWithCors,
  type JsonObject,
  type PayloadRequest,
  type TypeWithID,
} from 'payload'
import { promisify } from 'util'
import { gzip } from 'zlib'

import type { PageSpeedPluginConfig } from '../../types/index.js'
import type { FetchPageSpeedReportFn } from './fetchPageSpeedReport.js'

import { extractQueryFromSource } from '../../utilities/extractQueryFromSource.js'
import { fetchPageSpeedReport } from './fetchPageSpeedReport.js'

const gzipPromise = promisify(gzip)

type Args = {
  fetchReportFn?: FetchPageSpeedReportFn
  insightsSlug: string
  pluginConfig: PageSpeedPluginConfig
  reportsSlug: string
  req: PayloadRequest
}

export const pageSpeedEndpointHandler = async ({
  fetchReportFn = fetchPageSpeedReport,
  insightsSlug,
  pluginConfig,
  reportsSlug,
  req,
}: Args) => {
  const headers = headersWithCors({ headers: new Headers(), req })

  if (!pluginConfig.apiKey) {
    return Response.json(
      {
        message: req.t('error:noMatchedField', { label: 'apiKey' }),
      },
      { headers, status: 400 },
    )
  }

  const accessResults = await getAccessResults({ req })
  const collectionAccessResult = accessResults.collections?.[insightsSlug]
  const hasPermissions = collectionAccessResult?.create && collectionAccessResult?.read

  if (!hasPermissions) {
    return Response.json(
      { message: req.t('error:notAllowedToPerformAction') },
      { headers, status: 401 },
    )
  }

  const payload = req.payload
  const { id } = req.routeParams || {}
  const hasExistingDoc = typeof id === 'string' || typeof id === 'number'
  let doc: (JsonObject & TypeWithID) | undefined = undefined

  if (hasExistingDoc) {
    try {
      if (typeof id === 'string' || typeof id === 'number') {
        doc = await payload.findByID({
          id,
          collection: insightsSlug,
          depth: 0,
          req,
        })
      }
    } catch (err) {
      const error = err as Error
      payload.logger.error(error)
      return Response.json({ message: req.t('error:notFound') }, { headers, status: 404 })
    }
  }

  if (doc?.report) {
    return Response.json(
      {
        report: doc.report,
      },
      { headers, status: 200 },
    )
  }

  const queryString = extractQueryFromSource({ doc, req })

  let report: JsonObject | undefined = undefined
  try {
    const {
      message,
      report: reportFromApi,
      status,
    } = await fetchReportFn({
      apiKey: pluginConfig.apiKey,
      queryString,
      req,
    })

    if (status === 'error') {
      return Response.json({ message }, { headers, status: 400 })
    }

    report = reportFromApi
  } catch (err) {
    const error = err as Error
    payload.logger.error(error)
    return Response.json({ message: req.t('error:unknown') }, { headers, status: 500 })
  }

  if (!report) {
    return Response.json({ message: req.t('error:unknown') }, { headers, status: 500 })
  }

  if (hasExistingDoc) {
    let reportId: number | string | undefined = undefined
    try {
      const timestamp = report['analysisUTCTimestamp']
      const requestedUrl = report['id']
      const uploadBuffer: Buffer = await gzipPromise(Buffer.from(JSON.stringify(report)))

      const reportDoc = await payload.create({
        collection: reportsSlug,
        data: {},
        file: {
          name:
            `${timestamp || new Date().toUTCString()}_${requestedUrl || reportsSlug}`.replace(
              /[:/.]+/g,
              '-',
            ) + '.json',
          data: uploadBuffer,
          mimetype: 'application/json',
          size: uploadBuffer.length,
        },
        req,
      })

      reportId = reportDoc.id
    } catch (err) {
      const error = err as Error
      payload.logger.error(error)
      return Response.json(
        { message: req.t('error:problemUploadingFile') },
        { headers, status: 500 },
      )
    }

    try {
      await payload.update({
        id,
        collection: insightsSlug,
        data: {
          report: reportId,
        },
        depth: 0,
        req,
      })
    } catch (err) {
      const error = err as Error
      payload.logger.error(error)
      return Response.json({ message: req.t('error:unknown') }, { headers, status: 500 })
    }
  }

  return Response.json({ message: req.t('general:success'), report })
}
