'use client'

import type { FC } from 'react'

import { useState } from 'react'

import type { Props as CollapsibleAuditDetailsProps } from './CollapsibleAuditDetails.js'

import { CollapsibleAuditDetails } from './CollapsibleAuditDetails.js'

type Props = Omit<CollapsibleAuditDetailsProps, 'onToggle'>

export const CollapsibleAudit: FC<Props> = ({ children, open: openFromProps, ...rest }) => {
  const [open, setOpen] = useState(openFromProps)
  return (
    <CollapsibleAuditDetails {...rest} onToggle={() => setOpen((o) => !o)} open={open}>
      {children}
    </CollapsibleAuditDetails>
  )
}
