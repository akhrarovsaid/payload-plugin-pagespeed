import type { TFunction } from '@payloadcms/translations'
import type { Data, JsonObject } from 'payload'

import type { PageSpeedReportObject } from '../types/pagespeed.js'

type Args = {
  apiRoute?: string
  collectionSlug: string
  doc: Data
  relationTo: string
  reportDoc?: JsonObject | number | string
  t: TFunction
}

export async function fetchReportDoc({
  apiRoute = '/api',
  collectionSlug,
  doc,
  relationTo,
  reportDoc: reportDocFromProps,
  t,
}: Args): Promise<PageSpeedReportObject> {
  let reportDoc: JsonObject | number | string | undefined = reportDocFromProps

  if (typeof reportDoc === 'undefined') {
    const apiRes = await fetch(`${apiRoute}/${collectionSlug}/${doc.id}/report`, {
      credentials: 'include',
    })

    const { message, report: dataFromApi } = await apiRes.json()

    if (!apiRes.ok) {
      throw new Error(message ?? t('error:unknown'))
    }

    if (typeof dataFromApi !== 'object') {
      reportDoc = dataFromApi
    } else {
      return dataFromApi as PageSpeedReportObject
    }
  }

  if (typeof reportDoc === 'string' || typeof reportDoc === 'number') {
    const apiUrl = `${apiRoute}/${relationTo}/${reportDoc}`
    const apiRes = await fetch(apiUrl, { credentials: 'include' })

    if (!apiRes.ok) {
      throw new Error(t('error:documentNotFound'))
    }

    reportDoc = (await apiRes.json()) as JsonObject
  }

  if (!reportDoc || typeof reportDoc !== 'object') {
    throw new Error(t('error:documentNotFound'))
  }

  const apiRes = await fetch(reportDoc.url, { credentials: 'include' })

  if (!apiRes.ok) {
    throw new Error(t('error:documentNotFound'))
  }

  return apiRes.json()
}
