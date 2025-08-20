'use client'

import type { FC } from 'react'

import type { PageSpeedReportObject } from '../../types/pagespeed.js'

import { getScoreColor } from '../../utilities/getScoreColor.js'
import { PageSpeedCategories, type PageSpeedCategory } from '../../utilities/pageSpeedCategories.js'
import { IndicatorLegend } from '../IndicatorLegend/index.js'
import { TextWithLinkParser } from '../TextWithLinkParser/index.js'
import './index.scss'
import { ScoreGauge } from './ScoreGauge.js'

type Props = {
  category: PageSpeedCategory
  large?: boolean
  report: PageSpeedReportObject
}

const DEFAULT_SIZE = 300
const DEFAULT_STROKEWIDTH = 20

const baseClass = 'psi-score-gauge'

export const CategoryScoreGauge: FC<Props> = ({ category: categoryFromProps, large, report }) => {
  const category = PageSpeedCategories[categoryFromProps]
  const score = Math.ceil((report?.lighthouseResult?.categories?.[category.key]?.score || 0) * 100)

  const size = DEFAULT_SIZE
  const strokeWidth = large ? DEFAULT_STROKEWIDTH / 1.5 : DEFAULT_STROKEWIDTH
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score / 100)

  const label = category?.label || categoryFromProps
  const LabelWrapper = large ? 'h3' : 'h6'
  const ScoreWrapper = large ? 'h2' : LabelWrapper

  const { description, manualDescription } = report.lighthouseResult
    ? report.lighthouseResult.categories[category.key]
    : {}
  const showDesc = description && large
  const showManualDesc = manualDescription && large

  const classes = [baseClass, large && `${baseClass}--large`].filter(Boolean).join(' ')

  return (
    <section className={classes}>
      <div className={`${baseClass}__score-container ${baseClass}__container`} title={label}>
        <ScoreGauge
          baseClass={baseClass}
          circumference={circumference}
          className={`${baseClass}__svg`}
          color={color}
          offset={offset}
          radius={radius}
          size={size}
          strokeWidth={strokeWidth}
        />
        <div className={`${baseClass}__score-outer-wrap`} style={{ color }}>
          <div className={`${baseClass}__score-inner-wrap`}>
            <ScoreWrapper className={`${baseClass}__score`}>{score}</ScoreWrapper>
          </div>
        </div>
      </div>
      <div className={`${baseClass}__label-container`}>
        <LabelWrapper className={`${baseClass}__label`}>{label}</LabelWrapper>
      </div>
      {(showDesc || showManualDesc) && (
        <div>
          {showDesc && (
            <p className={`${baseClass}__description`}>
              <TextWithLinkParser text={description} />
            </p>
          )}
          {showManualDesc && (
            <p className={`${baseClass}__description-manual`}>
              <TextWithLinkParser text={manualDescription} />
            </p>
          )}
        </div>
      )}
      {large && <IndicatorLegend />}
    </section>
  )
}
