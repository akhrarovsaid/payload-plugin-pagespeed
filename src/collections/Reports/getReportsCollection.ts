import type { CollectionConfig } from 'payload'

import type { PageSpeedPluginConfig } from '../../types/index.js'

import { getGenerateFilePrefixHook } from './hooks/getGenerateFilePrefixHook.js'

type Args = {
  pluginConfig: PageSpeedPluginConfig
}

export function getReportsCollection({ pluginConfig }: Args) {
  const slug = 'pagespeed-reports'

  const generateFilePrefixHook = getGenerateFilePrefixHook({ pluginConfig })

  const collection: CollectionConfig = {
    slug,
    admin: {
      hidden: !pluginConfig.debug,
    },
    fields: [],
    hooks: {
      beforeOperation: [generateFilePrefixHook],
    },
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
