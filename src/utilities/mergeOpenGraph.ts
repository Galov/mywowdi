import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const defaultOgImage = `${baseUrl}/coming-soon/hero-background.png`

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Quiet tactile objects in natural materials, created in Europe for focus, rhythm, and calm everyday presence.',
  images: [
    {
      url: defaultOgImage,
    },
  ],
  locale: 'en_US',
  siteName: 'MYWOWDI',
  title: 'MYWOWDI',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
