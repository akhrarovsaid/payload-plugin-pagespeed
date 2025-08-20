import type { FC } from 'react'

import type { CellProps } from '../../renderCells.js'

import './index.scss'

export type NodeValue = {
  lhId: string
  nodeLabel: string
  path: string
  selector: string
  snippet: string
}

const baseClass = 'psi-node-cell'

export const NodeCell: FC<CellProps<NodeValue>> = ({ value }) => {
  if (!value) {
    return null
  }

  const { nodeLabel, selector, snippet } = value
  return (
    <span className={baseClass}>
      <span className={`${baseClass}__label`}>{nodeLabel}</span>
      <code className={`${baseClass}__snippet`}>{snippet}</code>
      <span className={`${baseClass}__selector`}>{selector}</span>
    </span>
  )
}
