export type LighthouseAuditRef = {
  group: string
  id: string
  weight: number
}

export type LighthouseAuditDetailNode = {
  [key: string]: unknown
  description?: string
}

export type LighthouseAuditListDetails = {
  items: LighthouseAuditDetailNode[]
  type: 'list'
} & LighthouseAuditDetailNode

export type LighthouseAuditListSectionDetails = {
  type: 'list-section'
  value: ({ type: 'text'; value: string } & LighthouseAuditDetailNode) | LighthouseAuditDetails
} & LighthouseAuditDetailNode

export type LighthouseAuditNetworkTreeChain = {
  children: Record<string, LighthouseAuditNetworkTreeChain>
  isLongest?: true
  navStartToEndTime: number
  transferSize: number
  url: string
}

export type LighthouseAuditNetworkTreeDetails = {
  chains: Record<string, LighthouseAuditNetworkTreeChain>
  longestChain?: {
    duration: number
  }
  type: 'network-tree'
} & LighthouseAuditDetailNode

export type LighthouseAuditTableDetails = {
  headings: {
    granularity: number
    key: string
    label: string
    valueType: string
  }[]
  items: Partial<LighthouseAuditDetailNode>[]
  type: 'opportunity' | 'table'
} & LighthouseAuditDetailNode

export type LighthouseAuditDetails =
  | LighthouseAuditListDetails
  | LighthouseAuditListSectionDetails
  | LighthouseAuditNetworkTreeDetails
  | LighthouseAuditTableDetails

export type LighthouseAudit = {
  description?: string
  details?: LighthouseAuditDetails
  displayValue: string
  id: string
  score: null | number
  scoreDisplayMode: 'metricSavings' | 'notApplicable' | 'numeric'
  title: string
}

export type PageSpeedReportObject = {
  [key: string]: unknown
  lighthouseResult?: {
    audits: Record<string, LighthouseAudit>
    categories: Record<
      string,
      {
        auditRefs: LighthouseAuditRef[]
        description?: string
        manualDescription?: string
        score: number
        title: string
      }
    >
    categoryGroups: Record<
      string,
      {
        description?: string
        title: string
      }
    >
  }
  url: string
}
