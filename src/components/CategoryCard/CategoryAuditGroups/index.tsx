import type { FC } from 'react'

import type { PageSpeedReportObject } from '../../../types/pagespeed.js'
import type { PageSpeedCategory } from '../../../utilities/pageSpeedCategories.js'

import { PageSpeedCategories } from '../../../utilities/pageSpeedCategories.js'
import { ScreenshotBar } from '../ScreenshotBar/ScreenshotBar.js'
import './index.scss'
import { CategoryAuditGroupsClient } from './index.client.js'
import { reduceReportToAudits } from './reduceReportToAudits.js'

type Props = {
  category: PageSpeedCategory
  report: PageSpeedReportObject
}

const baseClass = 'psi-audit-groups'

export const CategoryAuditGroups: FC<Props> = ({ category, report }) => {
  const classes = [baseClass, `${baseClass}-${PageSpeedCategories[category].key}`].join(' ')
  const isPerformance = category === PageSpeedCategories.PERFORMANCE.value
  const [audits = {}, auditGroups = []] = reduceReportToAudits({ category, report })

  return (
    <div className={classes}>
      {Object.entries(auditGroups).map(([groupName, auditItems]) => {
        const isMetrics = groupName === 'metrics'
        const isHiddenOrPassed = groupName === 'hidden' || groupName === 'passed'
        return (
          <div
            className={[
              `${baseClass}__group`,
              `${baseClass}__group-${groupName}`,
              isMetrics && `${baseClass}__group--expanded`,
              isHiddenOrPassed && `${baseClass}__group--hidden`,
            ]
              .filter(Boolean)
              .join(' ')}
            key={groupName}
          >
            <CategoryAuditGroupsClient
              auditItems={auditItems}
              audits={audits}
              baseClass={baseClass}
              groupName={groupName}
              isHiddenOrPassed={isHiddenOrPassed}
              isMetrics={isMetrics}
            />
            {isPerformance && isMetrics && <ScreenshotBar audits={audits} />}
          </div>
        )
      })}
    </div>
  )
}
