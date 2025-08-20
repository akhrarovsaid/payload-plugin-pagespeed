import type { Payload, PayloadRequest } from 'payload'

import { insightsSlug, reportsSlug } from 'helpers/defaults.js'
import { promisify } from 'util'
import { gzip } from 'zlib'

import { devUser } from './helpers/credentials.js'
import { getMockFetchReportFn } from './test/mock/fetchReport.js'

const gzipPromise = promisify(gzip)

export const seed = async (payload: Payload, reset?: boolean) => {
  const req = { payload } as PayloadRequest

  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
      req,
    })
  }

  if (reset) {
    await payload.delete({ collection: insightsSlug, depth: 0, req, where: {} })
    await payload.delete({ collection: reportsSlug, depth: 0, req, where: {} })
  }

  const { totalDocs: totalReports } = await payload.count({
    collection: insightsSlug,
    req,
  })

  if (!totalReports) {
    const getMockReport = getMockFetchReportFn({ filePath: 'mock-report-desktop.json' })
    const { report } = await getMockReport({
      apiKey: '',
      queryString: '',
      req: { payload } as PayloadRequest,
    })

    const uploadBuffer: Buffer = await gzipPromise(Buffer.from(JSON.stringify(report)))

    const reportDoc = await payload.create({
      collection: reportsSlug,
      data: {},
      depth: 0,
      file: {
        name: `${new Date().toUTCString()}_${reportsSlug}`.replace(/[:/.\s,]+/g, '-') + '.json',
        data: uploadBuffer,
        mimetype: 'application/json',
        size: uploadBuffer.length,
      },
      req,
    })

    await payload.create({
      collection: insightsSlug,
      data: {
        report: reportDoc.id,
        title: 'Seeded by plugin',
        url: 'https://localhost:3000',
      },
      depth: 0,
      req,
    })
  }
}
