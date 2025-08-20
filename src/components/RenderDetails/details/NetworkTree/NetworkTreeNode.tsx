import type { FC } from 'react'

import type { LighthouseAuditNetworkTreeChain } from '../../../../types/pagespeed.js'

import { formatBytes } from '../../../../utilities/formatBytes.js'
import { baseClass as networkTreeBaseClass } from './index.js'

export const NetworkTreeNode: FC<{ isRoot?: boolean } & LighthouseAuditNetworkTreeChain> = (
  props,
) => {
  const {
    children: childChains,
    isLongest,
    isRoot,
    navStartToEndTime,
    transferSize: transferSizeFromProps,
    url,
  } = props
  const baseClass = `${networkTreeBaseClass}__node`
  const classes = [baseClass, isRoot && `${baseClass}--root`, isLongest && `${baseClass}--longest`]
    .filter(Boolean)
    .join(' ')

  const transferSize = formatBytes(transferSizeFromProps)

  return (
    <div className={classes}>
      <p className={`${baseClass}__label`}>
        {url}, <b>{navStartToEndTime} ms,</b> {transferSize}
      </p>
      {Object.entries(childChains).map(([accessor, chain]) => (
        <NetworkTreeNode key={accessor} {...chain} />
      ))}
    </div>
  )
}
