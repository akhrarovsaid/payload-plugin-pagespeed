import type {
  LighthouseAudit,
  LighthouseAuditRef,
  PageSpeedReportObject,
} from '../../../types/pagespeed.js'

import {
  PageSpeedCategories,
  type PageSpeedCategory,
} from '../../../utilities/pageSpeedCategories.js'

export function reduceReportToAudits({
  category,
  report,
}: {
  category: PageSpeedCategory
  report: PageSpeedReportObject
}): [Record<string, LighthouseAudit>, Record<string, LighthouseAuditRef[]>, LighthouseAuditRef[]] {
  const auditRefs = report?.lighthouseResult?.categories?.[PageSpeedCategories[category].key]
    .auditRefs as LighthouseAuditRef[]

  const audits = report?.lighthouseResult?.audits as Record<string, LighthouseAudit>

  const auditGroups = auditRefs?.reduce(
    (acc, item) => {
      let group = item.group

      const audit = audits[item.id]
      const isMetrics = group === 'metrics'

      if ((!audit || !audit.details) && !isMetrics) {
        return acc
      }

      if (audit.score === 1 && !isMetrics) {
        group = 'passed'
        item.group = group
      }

      if (!acc[group]) {
        acc[group] = []
      }

      acc[group].push(item)
      return acc
    },
    {} as Record<string, LighthouseAuditRef[]>,
  )

  return [audits, auditGroups, auditRefs]
}
