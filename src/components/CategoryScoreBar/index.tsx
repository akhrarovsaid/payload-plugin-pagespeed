'use client'

import type { FC } from 'react'

import type { PageSpeedReportObject } from '../../types/pagespeed.js'

import { PageSpeedCategories, type PageSpeedCategory } from '../../utilities/pageSpeedCategories.js'
import { CategoryScoreGauge } from '../CategoryScoreGauge/index.js'
import './index.scss'

type Props = {
  categories?: PageSpeedCategory[]
  report?: PageSpeedReportObject
}

const baseClass = 'psi-score-bar'

export const CategoryScoreBar: FC<Props> = ({ categories = [], report }) => {
  if (!report) {
    return null
  }
  const categoriesShown: PageSpeedCategory[] = categories
  return (
    <section className={baseClass}>
      <div className={`${baseClass}__row`}>
        {categoriesShown.map((categoryKey) => {
          const { key, value } = PageSpeedCategories[categoryKey]
          return <CategoryScoreGauge category={value} key={key} report={report} />
        })}
      </div>
    </section>
  )
}
