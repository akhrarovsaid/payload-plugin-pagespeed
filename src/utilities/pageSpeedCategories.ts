export const PageSpeedCategories = {
  ACCESSIBILITY: { key: 'accessibility', label: 'Accessibility', value: 'ACCESSIBILITY' },
  BEST_PRACTICES: { key: 'best-practices', label: 'Best Practices', value: 'BEST_PRACTICES' },
  PERFORMANCE: { key: 'performance', label: 'Performance', value: 'PERFORMANCE' },
  SEO: { key: 'seo', label: 'SEO', value: 'SEO' },
} as const

export type PageSpeedCategory =
  (typeof PageSpeedCategories)[keyof typeof PageSpeedCategories]['value']
