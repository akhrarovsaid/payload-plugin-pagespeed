import fs from 'fs/promises'
import path from 'path'

import type { FetchPageSpeedReportFn } from '../../../src/endpoints/pagespeed/fetchPageSpeedReport.js'
import type { PageSpeedReportObject } from '../../../src/types/pagespeed.js'

export const getMockFetchReportFn: ({
  filePath,
}: {
  filePath: string
}) => FetchPageSpeedReportFn = ({ filePath }) => {
  const mockReportPath = path.join(__dirname, filePath)

  return async () => {
    const mockReport: PageSpeedReportObject = JSON.parse(await fs.readFile(mockReportPath, 'utf-8'))
    return {
      report: mockReport,
      status: 'success',
    }
  }
}
