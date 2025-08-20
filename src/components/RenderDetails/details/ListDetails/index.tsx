import { type FC, Fragment } from 'react'

import type { LighthouseAuditDetails } from '../../../../types/pagespeed.js'

import { RenderDetails, type RenderDetailsProps } from '../../index.js'

export const ListDetails: FC<RenderDetailsProps> = ({ details }) => {
  if (details.type !== 'list') {
    return null
  }

  const items = details.items as LighthouseAuditDetails[]

  return (
    <Fragment>
      {items.map((auditDetail, i) => (
        <RenderDetails details={auditDetail} key={`${auditDetail.type}.${i}`} />
      ))}
    </Fragment>
  )
}
