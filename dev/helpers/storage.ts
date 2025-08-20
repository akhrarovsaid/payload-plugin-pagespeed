import { s3Storage } from '@payloadcms/storage-s3'

export const storageAdapter = s3Storage({
  bucket: process.env.S3_BUCKET || '',
  collections: {
    'pagespeed-reports': true,
  },
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET || '',
    },
    endpoint: process.env.S3_ENDPOINT || '',
    region: process.env.S3_REGION || '',
  },
})
