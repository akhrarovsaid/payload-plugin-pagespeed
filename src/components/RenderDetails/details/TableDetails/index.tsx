import type { ClientField } from 'payload'

import { Table } from '@payloadcms/ui'
import { type FC } from 'react'

import type { LighthouseAuditTableDetails } from '../../../../types/pagespeed.js'

import { TextWithLinkParser } from '../../../TextWithLinkParser/index.js'
import { type RenderDetailsProps } from '../../index.js'
import { renderCells } from './renderCells.js'
import './index.scss'

const baseClass = 'psi-table-details'

const getTableDataFromDetails = ({ details }: { details: LighthouseAuditTableDetails }) => {
  const { headings, items } = details

  const columns = headings
    .filter((headings) => Boolean(headings.key))
    .map((heading) => ({
      accessor: heading.key,
      active: true,
      field: { name: heading.key, type: 'text' } as ClientField,
      Heading: heading.label || (
        <span style={{ textTransform: 'capitalize' }}>{heading.valueType}</span>
      ),
      renderedCells: renderCells({ heading, items }),
    }))

  return {
    columns,
    data: items,
  }
}

export const TableDetails: FC<RenderDetailsProps> = ({ details }) => {
  if ((details.type !== 'table' && details.type !== 'opportunity') || !details.items.length) {
    return null
  }

  const { columns, data } = getTableDataFromDetails({ details })

  return (
    <div className={baseClass}>
      <Table
        appearance="condensed"
        BeforeTable={
          details.description && (
            <p>
              <TextWithLinkParser text={details.description} />
            </p>
          )
        }
        columns={columns}
        data={data}
      />
    </div>
  )
}
