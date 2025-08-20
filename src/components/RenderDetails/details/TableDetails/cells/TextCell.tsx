import type { FC } from 'react'

type Props = {
  value: number | string
  valueType: string
}

export const TextCell: FC<Props> = ({ value, valueType }) => {
  if (valueType === 'bytes' && typeof value === 'number') {
    return `${(value / 1000).toFixed(0)} kb`
  }

  if ((valueType === 'ms' || valueType === 'timespanMs') && typeof value === 'number') {
    return `${value.toFixed(0)} ms`
  }

  return value
}
