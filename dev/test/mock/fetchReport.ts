import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import type { FetchPageSpeedReportFn } from '../../../src/endpoints/pagespeed/fetchPageSpeedReport.js'
import type { PageSpeedReportObject } from '../../../src/types/pagespeed.js'

export const getMockFetchReportFn: ({
  filePath,
}: {
  filePath: string
}) => FetchPageSpeedReportFn = ({ filePath }) => {
  const mockReportPath = path.join(dirname(fileURLToPath(import.meta.url)), filePath)

  return async () => {
    const mockReport: PageSpeedReportObject = JSON.parse(await fs.readFile(mockReportPath, 'utf-8'))
    return {
      report: mockReport,
      status: 'success',
    }
  }
}
