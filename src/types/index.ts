import type { CollectionConfig, PayloadRequest, SanitizedCollectionConfig } from 'payload'

export type CollectionOverride = (collection: CollectionConfig) => CollectionConfig

export type GenerateFileNameFnArgs = {
  analysisTimestamp: string
  extension?: string
  requestedUrl: string
}
export type GenerateFileNameFn = (args: GenerateFileNameFnArgs) => string

export type GenerateFilePrefixFnArgs = {
  collection: SanitizedCollectionConfig
  req: PayloadRequest
}
export type GenerateFilePrefixFn = (args: GenerateFilePrefixFnArgs) => string

export type PageSpeedPluginConfig = {
  apiKey: string
  debug?: boolean
  disabled?: boolean
  generateFileName?: GenerateFileNameFn
  generateFilePrefix?: GenerateFilePrefixFn
  overrideInsightsCollection?: CollectionOverride
  overrideReportsCollection?: CollectionOverride
}
