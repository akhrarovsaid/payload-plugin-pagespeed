import type { ComponentProps, FC } from 'react'

import type { LighthouseAudit } from '../../../types/pagespeed.js'

import { ScreenshotThumbnail } from '../ScreenshotThumbnail/index.js'
import './index.scss'

type Props = {
  audits: Record<string, LighthouseAudit>
} & ComponentProps<'div'>

const baseClass = 'psi-screenshot-bar'

export const ScreenshotBar: FC<Props> = ({ audits, className, ...rest }) => {
  const screenshots = audits['screenshot-thumbnails']?.details?.items as { data: string }[]

  if (!screenshots || !screenshots.length) {
    return null
  }

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')} {...rest}>
      {screenshots.map(({ data }, i) => (
        <ScreenshotThumbnail
          alt={`A screenshot thumbnail of a page being enhanced #${i + 1}`}
          className={`${baseClass}__item`}
          key={i}
          src={data}
        />
      ))}
    </div>
  )
}

/**
 * <img
            alt={`A screenshot thumbnail of a page being enhanced #${i + 1}`}
            key={i}
            src={data}
            style={{
              border: '1px solid var(--theme-elevation-200)',
              boxSizing: 'border-box',
              display: 'block',
              flex: '1 1 0',
              height: 'auto',
              maxWidth: '100%',
              minWidth: 0,
              padding: 'calc(var(--base) / 4)',
            }}
          />
 */
