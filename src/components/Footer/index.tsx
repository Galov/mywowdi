import type { Footer } from '@/payload-types'
import type { ContentLocale } from '@/i18n/config'

import { FooterMenu } from '@/components/Footer/menu'
import { getLocalizedHref } from '@/i18n/routing'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon } from '@/components/icons/logo'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer({ locale }: { locale: ContentLocale }) {
  const footer: Footer = await getCachedGlobal('footer', locale, 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''
  const isBulgarian = locale === 'bg'

  return (
    <footer className="text-sm text-primary/62">
      <div className="container">
        <div className="flex w-full flex-col gap-8 border-t border-border/80 py-12 text-sm md:flex-row md:gap-12">
          <div className="md:min-w-44">
            <Link
              className="flex items-center gap-3 text-primary md:pt-1"
              href={getLocalizedHref(locale, '/')}
            >
              <LogoIcon className="w-12" />
              <span className="font-display text-xl">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs leading-6 text-primary/62">
              {isBulgarian
                ? 'Тихо присъствие, естествени материали и премиум усещане за ръката.'
                : 'Quiet presence, natural materials and a premium tactile feel.'}
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu locale={locale} menu={menu} />
          </Suspense>
        </div>
      </div>
      <div className="border-t border-border/80 py-6 text-sm">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''}{' '}
            {isBulgarian ? 'Всички права запазени.' : 'All rights reserved.'}
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-border md:inline-block" />
          <p>{isBulgarian ? 'Създадено за европейския пазар.' : 'Designed for the European market.'}</p>
        </div>
      </div>
    </footer>
  )
}
