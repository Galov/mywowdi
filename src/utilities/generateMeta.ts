import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Product }): Promise<Metadata> => {
  const { doc } = args || {}
  const defaultTitle = 'MYWOWDI'
  const fallbackTitle = doc?.title ? `${doc.title} | ${defaultTitle}` : defaultTitle
  const fallbackDescription =
    'Quiet tactile objects in natural materials, created in Europe for focus, rhythm, and calm everyday presence.'

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  return {
    description: doc?.meta?.description || fallbackDescription,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || fallbackDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: doc?.meta?.title || fallbackTitle,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title: doc?.meta?.title || fallbackTitle,
    twitter: {
      card: 'summary_large_image',
      description: doc?.meta?.description || fallbackDescription,
      images: ogImage ? [ogImage] : undefined,
      title: doc?.meta?.title || fallbackTitle,
    },
  }
}
