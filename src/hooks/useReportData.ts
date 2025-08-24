import type { TFunction } from '@payloadcms/translations'
import type { Data, JsonObject } from 'payload'

import { useConfig, useField, useTranslation } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

import type { PageSpeedReportObject } from '../types/pagespeed.js'

import { fetchReportDoc } from '../utilities/fetchReportDoc.js'

type ReportState =
  | { error?: string; status: 'error' }
  | { report: PageSpeedReportObject; status: 'success' }
  | { status: 'loading' }

type Args = {
  collectionSlug: string
  doc: Data
  path: string
  relationTo: string
  reportDoc: JsonObject | string
}

export function useReportData({
  collectionSlug,
  doc,
  path,
  relationTo,
  reportDoc: reportDocFromProps,
}: Args) {
  const { value: reportDocValue } = useField<JsonObject>({ path })
  const {
    config: {
      routes: { api: apiRoute },
    },
  } = useConfig()
  const { t } = useTranslation()

  const [state, setState] = useState<ReportState>({ status: 'loading' })

  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) {
      return
    }

    hasFetched.current = true
    let cancelled = false

    const run = async () => {
      setState({ status: 'loading' })
      try {
        const report = await fetchReportDoc({
          apiRoute,
          collectionSlug,
          doc,
          relationTo,
          reportDoc: reportDocValue || reportDocFromProps,
          t: t as TFunction,
        })
        setState({ report, status: 'success' })
      } catch (err) {
        setState({
          error: err instanceof Error ? err.message : t('error:unknown'),
          status: 'error',
        })
      }
    }

    if (!cancelled) {
      void run()
    }

    return () => {
      cancelled = true
    }
  }, [collectionSlug, doc, relationTo, reportDocFromProps, reportDocValue, t])

  return state
}
