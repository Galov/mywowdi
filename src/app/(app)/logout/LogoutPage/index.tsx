'use client'

import { useAuth } from '@/providers/Auth'
import { getLocalizedHref } from '@/i18n/routing'
import { useCurrentLocale } from '@/i18n/useCurrentLocale'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = (props) => {
  const locale = useCurrentLocale()
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Logged out successfully.')
      } catch (_) {
        setError('You are already logged out.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div className="prose">
          <h1>{error || success}</h1>
          <p>
            What would you like to do next?
            <Fragment>
              {' '}
              <Link href={getLocalizedHref(locale, '/shop')}>Click here</Link>
              {` to shop.`}
            </Fragment>
            {` To log back in, `}
            <Link href={getLocalizedHref(locale, '/login')}>click here</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
