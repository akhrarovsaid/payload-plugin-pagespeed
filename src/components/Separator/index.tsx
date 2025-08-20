import type { ComponentProps, FC } from 'react'

import './index.scss'

type Props = {
  vertical?: boolean
} & ComponentProps<'div'>

const baseClass = 'psi-separator'

export const Separator: FC<Props> = (props) => (
  <div
    {...props}
    className={[baseClass, props.vertical && 'vertical', props.className].filter(Boolean).join(' ')}
  />
)
