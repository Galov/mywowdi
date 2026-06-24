import type { Metadata } from 'next'
import type { ContentLocale } from '@/i18n/config'

import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'
import { defaultLocale } from '@/i18n/config'
import { normalizeLocale } from '@/i18n/routing'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params?: Promise<{ locale?: string }>
  searchParams?: Promise<{ token?: string }>
}) {
  const localeParams = params ? await params : undefined
  const locale: ContentLocale = normalizeLocale(localeParams?.locale ?? defaultLocale)
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  return (
    <div className="container py-16">
      <ResetPasswordForm locale={locale} token={resolvedSearchParams?.token} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Set a new password for your MYWOWDI account.',
  openGraph: mergeOpenGraph({
    title: 'Reset Password',
    url: '/reset-password',
  }),
  title: 'Reset Password',
}
