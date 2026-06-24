import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { contentLocaleCodes } from '@/i18n/config'

export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (context.disableRevalidate) {
      return doc
    }

    payload.logger.info(`Revalidating global: ${slug}`)

    for (const locale of contentLocaleCodes) {
      revalidateTag(`global_${slug}_${locale}`, 'max')
      revalidatePath(`/${locale}`, 'layout')
    }

    revalidatePath('/', 'layout')

    return doc
  }
