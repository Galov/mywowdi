type Props = {
  params?: Promise<{ locale?: string }>
}

import { defaultLocale } from '@/i18n/config'
import { getLocalizedHref, normalizeLocale } from '@/i18n/routing'
import { redirect } from 'next/navigation'

export default async function ShopPage({ params }: Props) {
  const localeParams = params ? await params : undefined
  const locale = normalizeLocale(localeParams?.locale ?? defaultLocale)

  redirect(`${getLocalizedHref(locale, '/')}#buy`)
}
