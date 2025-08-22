import type { CollectionBeforeOperationHook } from 'payload'

import type { PageSpeedPluginConfig } from '../../../types/index.js'

type Args = {
  pluginConfig: PageSpeedPluginConfig
}

export function getGenerateFilePrefixHook({
  pluginConfig: { generateFilePrefix },
}: Args): CollectionBeforeOperationHook {
  return ({ collection, operation, req }) => {
    if (
      req.file &&
      req.data &&
      (operation === 'create' || operation === 'update') &&
      typeof generateFilePrefix !== 'undefined'
    ) {
      req.data.prefix = generateFilePrefix({
        collection,
        req,
      })
    }
  }
}
