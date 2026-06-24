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
  const skeleton = 'h-6 w-full animate-pulse rounded bg-white/8'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''
  const isBulgarian = locale === 'bg'

  return (
    <footer className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] text-sm text-[#d8c8b7]/72">
      <div className="container">
        <div className="flex w-full flex-col gap-8 border-t border-white/10 py-12 text-sm md:flex-row md:gap-12">
          <div className="md:min-w-44">
            <Link
              className="flex items-center gap-3 text-[#f2e7da] md:pt-1"
              href={getLocalizedHref(locale, '/')}
            >
              <LogoIcon className="w-12" />
              <span className="font-display text-xl">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs leading-6 text-[#d8c8b7]/68">
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
      <div className="border-t border-white/10 py-6 text-sm text-[#d8c8b7]/66">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>
            &copy; {currentYear} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''}{' '}
            {isBulgarian ? 'Всички права запазени.' : 'All rights reserved.'}
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-white/12 md:inline-block" />
          <p>{isBulgarian ? 'Създадено за европейския пазар.' : 'Designed for the European market.'}</p>
        </div>
      </div>
    </footer>
  )
}
