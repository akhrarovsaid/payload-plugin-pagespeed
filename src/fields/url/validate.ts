import type { TextFieldSingleValidation } from 'payload'

import { text } from 'payload/shared'

const pattern =
  /^(?:https?:\/\/)?(?:localhost|\d{1,3}(?:\.\d{1,3}){3}|(?:[\w-]+\.)+[a-z]{2,})(?::\d{1,5})?(?:\/\S*)?$/i

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
