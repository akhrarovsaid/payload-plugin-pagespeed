import type { JsonObject, PayloadRequest, TypeWithID } from 'payload'

import type { PageSpeedCategory } from './pageSpeedCategories.js'
import type { PageSpeedStrategy } from './pageSpeedStrategies.js'

type Args = {
  doc?: JsonObject & TypeWithID
  req: PayloadRequest
}

type QueryArgs = {
  captchaToken?: string
  category?: PageSpeedCategory
  locale?: string
  strategy?: PageSpeedStrategy
  url: string
  // These use snakecase for easier query interop with PageSpeed Insights api
  utm_campaign?: string
  utm_source?: string
}

export function extractQueryFromSource({ doc, req }: Args): string {
  let queryArgs = req.query
  if (doc) {
    const { id: _, createdAt: __, updatedAt: ___, utmCampaign, utmSource, ...stripped } = doc
    queryArgs = {
      ...stripped,
      utm_campaign: utmCampaign,
      utm_source: utmSource,
    } as QueryArgs
  }

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(queryArgs)) {
    if (typeof value === 'undefined') {
      continue
    }

    if (key === 'categories' && Array.isArray(value)) {
      for (const v of value) {
        params.append('category', v)
      }
    } else {
      params.append(key, String(value as string))
    }
  }

  return params.toString()
}
