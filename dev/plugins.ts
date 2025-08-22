import type { Plugin } from 'payload'
import type { PageSpeedPluginConfig } from 'payload-plugin-pagespeed'

import { pageSpeedPlugin } from 'payload-plugin-pagespeed'

export const pageSpeedPluginConfig: PageSpeedPluginConfig = {
  apiKey: process.env.PAGESPEED_API_KEY || 'fake-api-key',
  debug: true,
  generateFileName: () => 'test-report.json',
}

export const plugins: Plugin[] = [pageSpeedPlugin(pageSpeedPluginConfig)]
