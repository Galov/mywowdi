import type { Metadata } from 'next'
import type { ContentLocale } from '@/i18n/config'

import { RenderParams } from '@/components/RenderParams'
import { defaultLocale } from '@/i18n/config'
import { getLocalizedHref, normalizeLocale } from '@/i18n/routing'
import Link from 'next/link'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login({
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
    <div className="container">
      <div className="max-w-xl mx-auto my-12">
        <RenderParams />

        <h1 className="mb-4 text-[1.8rem]">Log in</h1>
        <p className="mb-8">
          {`This is where your customers will login to manage their account, review their order history, and more. To manage all users, `}
          <Link href="/admin/collections/users">login to the admin dashboard</Link>.
        </p>
        <LoginForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}
