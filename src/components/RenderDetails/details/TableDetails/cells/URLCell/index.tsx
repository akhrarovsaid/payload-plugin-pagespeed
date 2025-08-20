import type { FC } from 'react'

import { Link } from '@payloadcms/ui'

import type { CellProps } from '../../renderCells.js'

import './index.scss'

const baseClass = 'psi-url-cell'

function safeGetHost(input: string) {
  try {
    const normalized = /^https?:\/\//i.test(input) ? input : `https://${input}`
    return new URL(normalized).host
  } catch {
    return null
  }
}

export const URLCell: FC<CellProps> = ({ value: valueFromProps }) => {
  const value = String(valueFromProps)
  const host = safeGetHost(value)

  return (
    <span className={baseClass}>
      <Link className={`${baseClass}__link`} href={value ?? '#'} title={value}>
        <span className={`${baseClass}__label`}>{value}</span>
      </Link>
      {host && <span className={`${baseClass}__host`}>{`(${host})`}</span>}
    </span>
  )
}
