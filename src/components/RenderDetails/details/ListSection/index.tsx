import { type FC } from 'react'

import { TextWithLinkParser } from '../../../TextWithLinkParser/index.js'
import { RenderDetails, type RenderDetailsProps } from '../../index.js'
import './index.scss'

const baseClass = 'psi-list-section'

export const ListSection: FC<RenderDetailsProps> = ({ details }) => {
  if (details.type !== 'list-section') {
    return null
  }

  if (details.value.type !== 'text') {
    return <RenderDetails details={details.value} />
  }

  const { description, title } = details
  const { value } = details.value

  return (
    <div className={baseClass}>
      {title ? (
        <p className={`${baseClass}__title`}>
          <b>{title as string}</b>
        </p>
      ) : null}
      <p className={`${baseClass}__value`}>{value}</p>
      {description && (
        <p className={`${baseClass}__description`}>
          <TextWithLinkParser text={description} />
        </p>
      )}
    </div>
  )
}
