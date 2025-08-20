import type { CollectionConfig } from 'payload'

import type { PageSpeedPluginConfig } from '../../types/index.js'

import { getPageSpeedEndpoint } from '../../endpoints/pagespeed/index.js'
import { PageSpeedCategories } from '../../utilities/pageSpeedCategories.js'
import { PageSpeedStrategies } from '../../utilities/pageSpeedStrategies.js'
import { getDeleteReportHook } from './hooks/getDeleteReportHook.js'
import { populateUseAsTitle } from './hooks/populateUseAsTitle.js'

type Args = {
  pluginConfig: PageSpeedPluginConfig
  reportsSlug: string
}

export function getInsightsCollection({ pluginConfig, reportsSlug }: Args): CollectionConfig {
  const pageSpeedCategoryOptions = [
    PageSpeedCategories.PERFORMANCE,
    PageSpeedCategories.ACCESSIBILITY,
    PageSpeedCategories.BEST_PRACTICES,
    PageSpeedCategories.SEO,
  ]
  const pageSpeedStrategyOptions = Object.values(PageSpeedStrategies)
  const slug = 'pagespeed-insights'

  const collection: CollectionConfig = {
    slug,
    access: {
      update: () => false,
    },
    admin: {
      defaultColumns: ['title', 'createdAt', 'categories', 'locale', 'utmCampaign', 'utmSource'],
      listSearchableFields: [
        'title',
        'id',
        'url',
        'strategy',
        'utmCampaign',
        'utmSource',
        'locale',
        'captchaToken',
      ],
      useAsTitle: 'title',
    },
    endpoints: [
      getPageSpeedEndpoint({
        insightsSlug: slug,
        pluginConfig,
        reportsSlug,
      }),
    ],
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            admin: {
              condition: (_, __, { operation }) => operation !== 'create',
            },
            fields: [
              {
                name: 'report',
                type: 'upload',
                admin: {
                  components: {
                    Field: 'payload-plugin-pagespeed/rsc#InsightsReport',
                  },
                },
                relationTo: reportsSlug,
              },
            ],
            label: 'Report',
          },
          {
            fields: [
              {
                name: 'url',
                type: 'text',
                admin: {
                  description: 'The URL to fetch and analyze.',
                },
                required: true,
              },
              {
                name: 'categories',
                type: 'select',
                admin: {
                  description:
                    'A Lighthouse category to run; if none are given, only Performance category will be run.',
                },
                defaultValue: pageSpeedCategoryOptions.map(({ value }) => value),
                hasMany: true,
                options: pageSpeedCategoryOptions,
              },
              {
                name: 'locale',
                type: 'text',
                admin: {
                  description:
                    'The locale used to localize formatted results. Accepts BCP 47 standard language tags.',
                },
              },
              {
                name: 'strategy',
                type: 'select',
                admin: {
                  description:
                    'The analysis strategy (desktop or mobile) to use where desktop is the default.',
                },
                options: pageSpeedStrategyOptions,
              },
              {
                name: 'utmCampaign',
                type: 'text',
                admin: {
                  description: 'Campaign name for analytics.',
                },
              },
              {
                name: 'utmSource',
                type: 'text',
                admin: {
                  description: 'Campaign source for analytics.',
                },
              },
              {
                name: 'captchaToken',
                type: 'text',
                admin: {
                  description: 'The captcha token passed when filling out a captcha.',
                },
              },
            ],
            label: 'Parameters',
          },
        ],
      },
      {
        name: 'title',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
    ],
    hooks: {
      afterDelete: [getDeleteReportHook({ reportsSlug })],
      beforeChange: [populateUseAsTitle],
    },
    labels: {
      plural: 'PageSpeed Insights',
      singular: 'PageSpeed Insight',
    },
    timestamps: true,
  }

  if (typeof pluginConfig.overrideInsightsCollection === 'function') {
    return pluginConfig.overrideInsightsCollection(collection)
  }

  return collection
}
