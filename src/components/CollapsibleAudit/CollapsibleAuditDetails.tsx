import type { FC, ReactNode } from 'react'

import { Button } from '@payloadcms/ui'

import './index.scss'
import { getScoreColor } from '../../utilities/getScoreColor.js'
import {
  CircleIndicatorIcon,
  SquareIndicatorIcon,
  TriangleIndicatorIcon,
} from '../IndicatorLegend/index.js'
import { Separator } from '../Separator/index.js'
import { TextWithLinkParser } from '../TextWithLinkParser/index.js'

const baseClass = 'psi-collapsible-audit'

export type Props = {
  children?: ReactNode
  description?: string
  displayValue?: string
  hideToggle?: boolean
  onToggle: () => void
  open?: boolean
  score: null | number
  showDisplayValue?: boolean
  title: string
}

const getIndicator = (score: number) => {
  if (score >= 0.9) {
    return <CircleIndicatorIcon />
  } // green
  if (score >= 0.5) {
    return <SquareIndicatorIcon />
  } // orange
  return <TriangleIndicatorIcon /> // red
}

export const CollapsibleAuditDetails: FC<Props> = ({
  children,
  description,
  displayValue,
  hideToggle,
  onToggle,
  open: openFromProps,
  score,
  showDisplayValue,
  title,
}) => {
  const classes = [
    baseClass,
    openFromProps && `${baseClass}--expanded`,
    hideToggle && `${baseClass}--hide-toggle`,
  ]
    .filter(Boolean)
    .join(' ')

  const indicator = getIndicator(score || 0)
  const color = getScoreColor(score || 0)

  return (
    <div className={classes}>
      <Separator />
      <label className={`${baseClass}__header`}>
        <div className={`${baseClass}__title`}>
          {indicator}
          <p>
            {title}{' '}
            {showDisplayValue && displayValue && <span style={{ color }}>— {displayValue}</span>}
          </p>
        </div>

        {!hideToggle && (
          <Button
            buttonStyle="none"
            className={`${baseClass}__toggler`}
            icon={'chevron'}
            onClick={onToggle}
            type="button"
          />
        )}
      </label>
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__collapsible`}>
          <div className={`${baseClass}__inner-content`}>
            {!hideToggle && description && (
              <p className={`${baseClass}__description`}>
                <TextWithLinkParser text={description} />
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
