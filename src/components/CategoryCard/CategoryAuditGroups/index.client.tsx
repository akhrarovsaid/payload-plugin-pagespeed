'use client'

import type { FC } from 'react'
import type { LighthouseAudit, LighthouseAuditRef } from 'src/types/pagespeed.js'

import { Pill } from '@payloadcms/ui'
import { Fragment, useState } from 'react'

import { CollapsibleAudit } from '../../CollapsibleAudit/index.js'
import { RenderDetails } from '../../RenderDetails/index.js'
import { Separator } from '../../Separator/index.js'

type Props = {
  auditItems: LighthouseAuditRef[]
  audits: Record<string, LighthouseAudit>
  baseClass: string
  groupName: string
  isHiddenOrPassed?: boolean
  isMetrics?: boolean
}

export const CategoryAuditGroupsClient: FC<Props> = ({
  auditItems,
  audits,
  baseClass,
  groupName,
  isHiddenOrPassed,
  isMetrics,
}) => {
  const [hidden, setHidden] = useState(isHiddenOrPassed)

  const toggleHidden = () => setHidden((v) => !v)

  return (
    <Fragment>
      <label className={`${baseClass}__group-header`}>
        <h5 className={`${baseClass}__group-title`}>
          {groupName} {hidden && `(${auditItems.length})`}
        </h5>
        <Pill onClick={toggleHidden} size="small">
          {hidden ? 'Show' : 'Hide'}
        </Pill>
      </label>
      {hidden ? (
        <Separator />
      ) : (
        <div
          className={[
            `${baseClass}__group-audits`,
            `${baseClass}__group-audits-${groupName}`,
            isMetrics && `${baseClass}__group-audits--expanded`,
            isHiddenOrPassed && `${baseClass}__group-audits--hidden`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {auditItems.map(({ id }) => {
            const {
              description,
              details,
              displayValue,
              score: scoreFromProps,
              scoreDisplayMode,
              title,
            } = audits[id]
            const score = scoreFromProps ?? 0

            const scoreClass =
              score >= 0.9
                ? `${baseClass}__score-green`
                : score >= 0.5
                  ? `${baseClass}__score-orange`
                  : `${baseClass}__score-red`

            return (
              <CollapsibleAudit
                description={description}
                displayValue={displayValue}
                hideToggle={isMetrics}
                key={id}
                open={isMetrics}
                score={score}
                showDisplayValue={scoreDisplayMode === 'metricSavings'}
                title={title}
              >
                {isMetrics ? (
                  <p className={[`${baseClass}__score`, scoreClass].filter(Boolean).join(' ')}>
                    {displayValue}
                  </p>
                ) : (
                  <RenderDetails details={details} />
                )}
              </CollapsibleAudit>
            )
          })}
        </div>
      )}
    </Fragment>
  )
}
