import type { Config } from 'payload'

import type { PageSpeedPluginConfig } from './types/index.js'

import { getInsightsCollection } from './collections/Insights/getInsightsCollection.js'
import { getReportsCollection } from './collections/Reports/getReportsCollection.js'

export const pageSpeedPlugin =
  (pluginConfig: PageSpeedPluginConfig) =>
  (config: Config): Config => {
    if (!pluginConfig.apiKey) {
      throw new Error(
        '[payload-plugin-pagespeed] Missing required "apiKey" in plugin configuration. Please provide a valid PageSpeed Insights API key.',
      )
    }

    if (!config.collections) {
      config.collections = []
    }

    const reportsCollection = getReportsCollection({ pluginConfig })
    const insightsCollection = getInsightsCollection({
      pluginConfig,
      reportsSlug: reportsCollection.slug,
    })

    config.collections.push(insightsCollection, reportsCollection)

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginConfig.disabled) {
      return config
    }

    return config
  }
