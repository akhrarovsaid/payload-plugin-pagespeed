import type { CollectionAfterDeleteHook } from 'payload'

type Args = {
  reportsSlug: string
}

export function getDeleteReportHook({ reportsSlug }: Args): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    if (typeof doc.report !== 'undefined') {
      const { payload } = req

      try {
        await payload.delete({
          id: typeof doc.report === 'object' ? doc.report.id : doc.report,
          collection: reportsSlug,
          depth: 0,
          req,
        })
      } catch (err) {
        const error = err as Error
        payload.logger.error(error, req.t('error:deletingFile'))
      }
    }
  }
}
