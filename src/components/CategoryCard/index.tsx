'use client'

import type { FC } from 'react'

import type { PageSpeedReportObject } from '../../types/pagespeed.js'

import { PageSpeedCategories, type PageSpeedCategory } from '../../utilities/pageSpeedCategories.js'
import { CategoryScoreGauge } from '../CategoryScoreGauge/index.js'
import { RenderIfInViewport } from '../RenderIfInViewport/index.js'
import { CategoryAuditGroups } from './CategoryAuditGroups/index.js'
import './index.scss'
import { ScreenshotThumbnail } from './ScreenshotThumbnail/index.js'

type Props = {
  category: PageSpeedCategory
  report?: PageSpeedReportObject
}

const baseClass = 'psi-category-card'

export const CategoryCard: FC<Props> = ({ category, report }) => {
  if (!report) {
    return null
  }

  const isPerformance = category === PageSpeedCategories.PERFORMANCE.value

  return (
    <RenderIfInViewport>
      <section className={`${baseClass} ${baseClass}-${PageSpeedCategories[category].key}`}>
        <div
          className={[`${baseClass}__overview`, !isPerformance && `${baseClass}__overview--center`]
            .filter(Boolean)
            .join(' ')}
        >
          <CategoryScoreGauge category={category} large report={report} />
          {isPerformance && (
            <ScreenshotThumbnail
              alt="Final screenshot audit thumbnail"
              src={report?.lighthouseResult?.audits['final-screenshot']?.details?.data as string}
            />
          )}
        </div>
        <CategoryAuditGroups category={category} report={report} />
      </section>
    </RenderIfInViewport>
  )
}
