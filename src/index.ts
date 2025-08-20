import type { Config } from 'payload'

import type { PageSpeedPluginConfig } from './types/index.js'

import { getInsightsCollection } from './collections/Insights/getInsightsCollection.js'
import { getReportsCollection } from './collections/Reports/getReportsCollection.js'

export const pageSpeedPlugin =
  (pluginConfig: PageSpeedPluginConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    const reportsCollection = getReportsCollection({ pluginConfig })
    const insightsCollection = getInsightsCollection({
      pluginConfig,
      reportsSlug: reportsCollection.slug,
    })

    config.collections.push(insightsCollection, reportsCollection)

    return config
  }
