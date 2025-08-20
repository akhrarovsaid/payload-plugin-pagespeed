'use client'

import type { Data, JsonObject } from 'payload'

import { useTranslation } from '@payloadcms/ui'
import { type FC } from 'react'

import type { PageSpeedCategory } from '../../utilities/pageSpeedCategories.js'

import './index.scss'
import { useReportData } from '../../hooks/useReportData.js'
import { PageSpeedCategories } from '../../utilities/pageSpeedCategories.js'
import { CategoryCard } from '../CategoryCard/index.js'
import { CategoryScoreBar } from '../CategoryScoreBar/index.js'
import { ErrorBanner } from '../ErrorBanner/index.js'
import { ProgressBanner } from '../ProgressBanner/index.js'
import { Separator } from '../Separator/index.js'

type Props = {
  collectionSlug: string
  doc: Data
  path: string
  relationTo: string
  reportDoc: JsonObject
}

const baseClass = 'psi-report'

export const InsightsReportClient: FC<Props> = ({
  collectionSlug,
  doc,
  path,
  relationTo,
  reportDoc,
}: Props) => {
  const reportState = useReportData({
    collectionSlug,
    doc,
    path,
    relationTo,
    reportDoc,
  })
  const { t } = useTranslation()

  if (reportState.status === 'error') {
    return <ErrorBanner>{reportState.error || t('error:unknown')}</ErrorBanner>
  }

  if (reportState.status === 'loading') {
    return <ProgressBanner />
  }

  const categories: PageSpeedCategory[] = doc.categories ?? []

  return (
    <article className={baseClass}>
      <CategoryScoreBar categories={categories} report={reportState.report} />
      <Separator />
      {categories.map((category) => (
        <CategoryCard
          category={PageSpeedCategories[category].value}
          key={category}
          report={reportState.report}
        />
      ))}
    </article>
  )
}
