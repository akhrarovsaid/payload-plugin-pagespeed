import { type PayloadHandler } from 'payload'

import type { PageSpeedPluginConfig } from '../../types/index.js'

import { pageSpeedEndpointHandler } from './handler.js'

type Args = {
  insightsSlug: string
  pluginConfig: PageSpeedPluginConfig
  reportsSlug: string
}

export const getPageSpeedEndpointHandler = (args: Args): PayloadHandler => {
  return async (req) => pageSpeedEndpointHandler({ ...args, req })
}
