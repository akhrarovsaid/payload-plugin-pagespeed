import type { TextFieldSingleValidation } from 'payload'

import { text } from 'payload/shared'

const pattern = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i

export const validate: TextFieldSingleValidation = (value, options) => {
  const { req } = options

  if (!value) {
    return req.t('validation:required')
  }

  if (!pattern.test(value)) {
    return req.t('validation:invalidInput')
  }

  return text(value, options)
}
