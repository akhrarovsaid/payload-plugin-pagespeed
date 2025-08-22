import type { GenerateFileNameFnArgs } from '../types/index.js'

export function defaultGenerateFileName({
  analysisTimestamp,
  extension = '.json',
  requestedUrl,
}: GenerateFileNameFnArgs) {
  // Remove protocol
  const urlWithoutProtocol = requestedUrl.replace(/^https?:\/\//, '')

  // Remove leading slash
  const urlCleaned = urlWithoutProtocol.replace(/^\/+/, '')

  // Replace unsafe filename characters with '_'
  const safeUrl = urlCleaned.replace(/[<>:"/\\|?*\s]/g, '-')

  // Replace colon in timestamp if present (common in ISO strings)
  const safeTimestamp = analysisTimestamp.replace(/:/g, '-')

  return `${safeTimestamp}_${safeUrl}${extension}`
}
