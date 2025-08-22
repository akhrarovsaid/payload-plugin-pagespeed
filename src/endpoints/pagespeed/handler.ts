import {
  commitTransaction,
  getAccessResults,
  headersWithCors,
  initTransaction,
  type JsonObject,
  killTransaction,
  type PayloadRequest,
  type TypeWithID,
} from 'payload'
import { promisify } from 'util'
import { gzip } from 'zlib'

import type { PageSpeedPluginConfig } from '../../types/index.js'
import type { FetchPageSpeedReportFn } from './fetchPageSpeedReport.js'

import { defaultGenerateFileName } from '../../utilities/defaultGenerateFileName.js'
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

  await initTransaction(req)

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
      doc = await payload.findByID({
        id,
        collection: insightsSlug,
        depth: 0,
        req,
      })
    } catch (err) {
      await killTransaction(req)
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
      await killTransaction(req)
      return Response.json({ message }, { headers, status: 400 })
    }

    report = reportFromApi
  } catch (err) {
    await killTransaction(req)
    const error = err as Error
    payload.logger.error(error)
    return Response.json(
      { error: { message: error.message }, message: req.t('error:unknown') },
      { headers, status: 500 },
    )
  }

  if (!report) {
    await killTransaction(req)
    return Response.json({ message: req.t('error:documentNotFound') }, { headers, status: 404 })
  }

  let reportDoc: TypeWithID | undefined = undefined
  if (hasExistingDoc) {
    try {
      const analysisTimestamp = report['analysisUTCTimestamp']
      const requestedUrl = report['id']
      const fileName =
        typeof pluginConfig.generateFileName === 'function'
          ? pluginConfig.generateFileName({ analysisTimestamp, requestedUrl })
          : defaultGenerateFileName({ analysisTimestamp, requestedUrl })

      const uploadBuffer: Buffer = await gzipPromise(Buffer.from(JSON.stringify(report)))

      reportDoc = await payload.create({
        collection: reportsSlug,
        data: {},
        file: {
          name: fileName,
          data: uploadBuffer,
          mimetype: 'application/json',
          size: uploadBuffer.length,
        },
        req,
      })
    } catch (err) {
      await killTransaction(req)
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
          report: reportDoc,
        },
        req,
      })
    } catch (err) {
      await killTransaction(req)
      const error = err as Error
      payload.logger.error(error)
      return Response.json({ message: req.t('error:unknown') }, { headers, status: 500 })
    }
  }

  await commitTransaction(req)

  return Response.json({ message: req.t('general:success'), report })
}
