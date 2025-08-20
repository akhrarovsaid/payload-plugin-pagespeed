import type { LighthouseAuditTableDetails } from '../../../../types/pagespeed.js'
import type { NodeValue } from './cells/NodeCell/index.js'

import { NodeCell } from './cells/NodeCell/index.js'
import { TextCell } from './cells/TextCell.js'
import { URLCell } from './cells/URLCell/index.js'

export type CellProps<Value = number | string> = {
  value: Value
  valueType: string
}

type CellItem = { type: 'numeric'; value: number | string } | null | string

export function renderCells({
  heading,
  items,
}: {
  heading: LighthouseAuditTableDetails['headings'][number]
  items: LighthouseAuditTableDetails['items']
}) {
  return items.map((item, rowIndex) => {
    const key = `${heading.key}-${rowIndex}`
    const value = item[heading.key] as CellProps['value']
    const valueType = heading.valueType

    switch (heading.valueType) {
      case 'node': {
        return <NodeCell key={key} value={value as unknown as NodeValue} valueType={valueType} />
      }
      case 'url': {
        return <URLCell key={key} value={value} valueType={valueType} />
      }
      default: {
        const cellItem = value as CellItem

        if (typeof cellItem === 'string' || typeof cellItem === 'number') {
          return (
            <TextCell
              key={`${heading.key}-${rowIndex}`}
              value={cellItem}
              valueType={heading.valueType}
            />
          )
        }

        if (typeof cellItem?.type === 'string' && cellItem?.type === 'numeric') {
          return (
            <TextCell
              key={`${heading.key}-${rowIndex}`}
              value={cellItem.value}
              valueType={heading.valueType}
            />
          )
        }

        return cellItem?.value
      }
    }
  })
}
