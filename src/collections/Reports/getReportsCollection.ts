import type { CollectionConfig } from 'payload'

import type { PageSpeedPluginConfig } from '../../types/index.js'

type Args = {
  pluginConfig: PageSpeedPluginConfig
}

export function getReportsCollection({ pluginConfig }: Args) {
  const slug = 'pagespeed-reports'

  const collection: CollectionConfig = {
    slug,
    admin: {
      hidden: !pluginConfig.debug,
    },
    fields: [],
    timestamps: false,
    upload: {
      modifyResponseHeaders: ({ headers }) => {
        headers.set('Content-Encoding', 'gzip')
      },
    },
  }

  if (typeof pluginConfig.overrideReportsCollection === 'function') {
    return pluginConfig.overrideReportsCollection(collection)
  }

  return collection
}
