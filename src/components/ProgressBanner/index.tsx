import { LoadingOverlay } from '@payloadcms/ui'

import './index.scss'

const baseClass = 'psi-progress-banner'

export const ProgressBanner = () => {
  return (
    <div className={baseClass}>
      <LoadingOverlay loadingText={'Analyzing Page...'} overlayType="absolute" />
    </div>
  )
}
