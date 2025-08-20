import type { JsonObject, UploadFieldServerProps } from 'payload'

import { type FC } from 'react'

import { InsightsReportClient } from './index.client.js'

export const InsightsReport: FC<UploadFieldServerProps> = async ({
  collectionSlug,
  data,
  field: { relationTo },
  path,
  req,
  value,
}) => {
  if (typeof data.id !== 'number' && typeof data.id !== 'string') {
    // TODO: translations
    return <p>Save the document to generate a report.</p>
  }

  let reportDoc = value as JsonObject
  if (typeof reportDoc === 'number' || typeof reportDoc === 'string') {
    // fetch actual report doc

    reportDoc = await req.payload.findByID({
      id: reportDoc,
      collection: relationTo,
    })
  }

  return (
    <InsightsReportClient
      collectionSlug={collectionSlug}
      doc={data}
      path={path}
      relationTo={relationTo}
      reportDoc={reportDoc}
    />
  )
}
