import type { ReactNode } from 'react'

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

  return (
    <div lang={resolvedLocale}>
      <Header locale={resolvedLocale} />
      <main>{children}</main>
      <Footer locale={resolvedLocale} />
    </div>
  )
}
