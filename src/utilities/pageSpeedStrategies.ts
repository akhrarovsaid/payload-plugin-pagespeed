export const PageSpeedStrategies = {
  DESKTOP: { label: 'Desktop', value: 'DESKTOP' },
  MOBILE: { label: 'Mobile', value: 'MOBILE' },
} as const

export type PageSpeedStrategy =
  (typeof PageSpeedStrategies)[keyof typeof PageSpeedStrategies]['value']
