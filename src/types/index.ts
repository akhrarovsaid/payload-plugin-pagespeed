import type { CollectionConfig, CollectionSlug } from 'payload'

export type CollectionOverride = (collection: CollectionConfig) => CollectionConfig

export type PageSpeedPluginConfig = {
  apiKey: string
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  debug?: boolean
  disabled?: boolean
  overrideInsightsCollection?: CollectionOverride
  overrideReportsCollection?: CollectionOverride
}
