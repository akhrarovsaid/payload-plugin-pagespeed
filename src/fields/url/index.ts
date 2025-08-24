import type { TextField } from 'payload'

import { formatURLHook } from './formatURL.js'
import { validate } from './validate.js'

type URLField = (overrides?: Partial<TextField>) => TextField

export const urlField: URLField = (overrides = {}) => {
  const { name = 'url', type: _, hasMany: __, ...rest } = overrides

  const field = {
    name,
    type: 'text',
    hooks: {
      beforeValidate: [formatURLHook],
    },
    validate,
    ...rest,
  } as TextField

  return field
}
