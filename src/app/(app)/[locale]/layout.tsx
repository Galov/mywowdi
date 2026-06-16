import type { ReactNode } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { ComingSoon } from '@/components/ComingSoon'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { normalizeLocale } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const resolvedLocale = normalizeLocale(locale)

  if (resolvedLocale !== locale) {
    notFound()
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  let comingSoonEnabled = true

  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    comingSoonEnabled = siteSettings.comingSoonEnabled ?? true
  } catch {
    comingSoonEnabled = true
  }

  if (comingSoonEnabled && !user) {
    return <ComingSoon locale={resolvedLocale} />
  }

  return (
    <div lang={resolvedLocale}>
      <Header locale={resolvedLocale} />
      <main>{children}</main>
      <Footer locale={resolvedLocale} />
    </div>
  )
}
