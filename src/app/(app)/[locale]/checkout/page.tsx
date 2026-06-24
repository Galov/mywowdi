import type { Metadata } from 'next'

import { getCheckoutCopy } from '@/components/checkout/copy'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export { default } from '../../checkout/page'

type Props = {
  params: Promise<{
    locale: 'bg' | 'de' | 'en' | 'es' | 'fr' | 'it'
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCheckoutCopy(locale)

  return {
    description: copy.checkoutMetaDescription,
    openGraph: mergeOpenGraph({
      title: copy.checkoutMetaTitle,
      url: `/${locale}/checkout`,
    }),
    title: copy.checkoutMetaTitle,
  }
}
