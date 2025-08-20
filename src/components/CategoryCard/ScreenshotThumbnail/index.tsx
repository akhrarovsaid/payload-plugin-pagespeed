import type { ComponentProps, FC } from 'react'

import './index.scss'

export type Props = {
  containerClassName?: string
} & ComponentProps<'img'>

const baseClass = 'psi-screenshot-thumbnail'

export const ScreenshotThumbnail: FC<Props> = ({ containerClassName, ...rest }) => (
  <div className={[baseClass, containerClassName].filter(Boolean).join(' ')}>
    <img
      {...rest}
      alt={rest.alt || ''}
      className={[`${baseClass}__img`, rest.className].filter(Boolean).join(' ')}
    />
  </div>
)
