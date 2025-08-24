import type { FieldHook } from 'payload'

export const formatURL = (val: string): string => {
  try {
    new URL(val)
    return val
  } catch {
    if (!val.startsWith('http://') || !val.startsWith('https://')) {
      return `https://${val}`
    }
    return val
  }
}

export const formatURLHook: FieldHook = ({ operation, value }) => {
  if (typeof value === 'string' && operation === 'create') {
    return formatURL(value)
  }
  return value
}
