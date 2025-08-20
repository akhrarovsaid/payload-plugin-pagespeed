import type { Data, JsonObject } from 'payload'

import type { PageSpeedReportObject } from '../types/pagespeed.js'

type Args = {
  collectionSlug: string
  doc: Data
  relationTo: string
  reportDoc?: JsonObject | number | string
}

export async function fetchReportDoc({
  collectionSlug,
  doc,
  relationTo,
  reportDoc: reportDocFromProps,
}: Args): Promise<PageSpeedReportObject> {
  let reportDoc: JsonObject | number | string | undefined = reportDocFromProps

  if (typeof reportDoc === 'undefined') {
    const apiRes = await fetch(`/api/${collectionSlug}/${doc.id}/report`, {
      credentials: 'include',
    })

    const { message, report: dataFromApi } = await apiRes.json()

    if (!apiRes.ok) {
      throw new Error(message ?? 'Unknown error')
    }

    if (typeof dataFromApi !== 'object') {
      reportDoc = dataFromApi
    } else {
      return dataFromApi as PageSpeedReportObject
    }
  }

  if (typeof reportDoc === 'string' || typeof reportDoc === 'number') {
    const apiUrl = `/api/${relationTo}/${reportDoc}`
    const apiRes = await fetch(apiUrl, { credentials: 'include' })

    if (!apiRes.ok) {
      throw new Error('Document not found')
    }

    reportDoc = (await apiRes.json()) as JsonObject
  }

  if (!reportDoc || typeof reportDoc !== 'object') {
    throw new Error('Invalid report document')
  }

  const apiRes = await fetch(reportDoc.url, { credentials: 'include' })

  if (!apiRes.ok) {
    throw new Error('Report file not found')
  }

  return apiRes.json()
}
