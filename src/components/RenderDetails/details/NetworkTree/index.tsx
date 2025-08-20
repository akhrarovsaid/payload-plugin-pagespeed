import { type FC } from 'react'

import { TextWithLinkParser } from '../../../TextWithLinkParser/index.js'
import { type RenderDetailsProps } from '../../index.js'
import { NetworkTreeNode } from './NetworkTreeNode.js'
import './index.scss'

export const baseClass = 'psi-network-tree'

export const NetworkTree: FC<RenderDetailsProps> = ({ details }) => {
  if (details.type !== 'network-tree') {
    return null
  }

  const { chains, description } = details

  return (
    <div className={baseClass}>
      {description && (
        <p>
          <TextWithLinkParser text={description} />
        </p>
      )}
      {Object.entries(chains).map(([accessor, chain]) => (
        <NetworkTreeNode key={accessor} {...chain} isRoot />
      ))}
    </div>
  )
}
