'use client'

import type { FC } from 'react'

import type { LighthouseAuditDetails } from '../../types/pagespeed.js'

import { ListDetails } from './details/ListDetails/index.js'
import { ListSection } from './details/ListSection/index.js'
import { NetworkTree } from './details/NetworkTree/index.js'
import { TableDetails } from './details/TableDetails/index.js'

export type RenderDetailsProps = {
  details: LighthouseAuditDetails
}

const detailComponents = {
  list: ListDetails,
  'list-section': ListSection,
  'network-tree': NetworkTree,
  opportunity: TableDetails,
  table: TableDetails,
} as const

export const RenderDetails: FC<Partial<RenderDetailsProps>> = ({ details }) => {
  if (!details) {
    return null
  }

  const Component = detailComponents[details.type]
  return Component ? <Component details={details} /> : null
}
