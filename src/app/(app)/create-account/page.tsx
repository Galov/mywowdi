import type { Metadata } from 'next'
import type { ContentLocale } from '@/i18n/config'

import { RenderParams } from '@/components/RenderParams'
import { defaultLocale } from '@/i18n/config'
import { getLocalizedHref, normalizeLocale } from '@/i18n/routing'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'

export default async function CreateAccount({
  params,
}: {
  params?: Promise<{ locale?: string }>
}) {
  const localeParams = params ? await params : undefined
  const locale: ContentLocale = normalizeLocale(localeParams?.locale ?? defaultLocale)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(
      `${getLocalizedHref(locale, '/account')}?warning=${encodeURIComponent('You are already logged in.')}`,
    )
  }

  return (
    <div className="container py-16">
      <h1 className="text-xl mb-4">Create Account</h1>
      <RenderParams />
      <CreateAccountForm />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
