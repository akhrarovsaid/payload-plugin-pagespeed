import type { FC, ReactNode } from 'react'

import { Banner } from '@payloadcms/ui'

type Props = {
  children?: ReactNode
}

export const ErrorBanner: FC<Props> = ({ children }) => {
  return <Banner type="error">{children}</Banner>
}
