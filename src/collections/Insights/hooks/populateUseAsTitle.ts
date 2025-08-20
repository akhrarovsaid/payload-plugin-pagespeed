import type { CollectionBeforeChangeHook } from 'payload'

import type { PageSpeedStrategy } from '../../../utilities/pageSpeedStrategies.js'

import { PageSpeedStrategies } from '../../../utilities/pageSpeedStrategies.js'

export const populateUseAsTitle: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation !== 'create' || typeof data.title !== 'undefined') {
    return data
  }

  const strategy =
    PageSpeedStrategies[data.strategy as PageSpeedStrategy] ?? PageSpeedStrategies.DESKTOP
  const requestedURL = data.url
  const formFactor = strategy.label

  data.title = `${requestedURL} - ${formFactor}`

  return data
}
