import type { Endpoint } from 'payload'

import type { PageSpeedPluginConfig } from '../../types/index.js'

import { getPageSpeedEndpointHandler } from './getPageSpeedEndpointHandler.js'

type Args = {
  insightsSlug: string
  pluginConfig: PageSpeedPluginConfig
  reportsSlug: string
}

export const getPageSpeedEndpoint = (args: Args): Endpoint => ({
  handler: getPageSpeedEndpointHandler(args),
  method: 'get',
  path: '/:id?/report',
})
