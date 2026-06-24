'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import type { ContentLocale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
  locale: ContentLocale
}

export function HeaderClient({ header, locale }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#120c0a] text-[#f2e7da] backdrop-blur-xl md:bg-[#120c0a]/88">
      <nav className="container min-h-[72px] py-3 md:min-h-[84px] md:py-4">
        <div className="flex h-12 items-center justify-between md:hidden">
          <div className="flex w-10 items-center justify-start">
            <Suspense fallback={null}>
              <MobileMenu locale={locale} menu={menu} />
            </Suspense>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Link className="flex items-center justify-center text-[#f2e7da]" href={getLocalizedHref(locale, '/')}>
              <LogoIcon className="h-auto w-11" />
            </Link>
          </div>

          <div className="flex w-10 items-center justify-end">
            <Suspense fallback={<OpenCartButton locale={locale} />}>
              <Cart locale={locale} />
            </Suspense>
          </div>
        </div>

        <div className="hidden items-center justify-between md:flex">
          <div className="flex w-full items-center gap-6 md:w-1/3">
            <Link
              className="flex items-center justify-center text-[#f2e7da]"
              href={getLocalizedHref(locale, '/')}
            >
              <LogoIcon className="h-auto w-12" />
            </Link>
            {menu.length ? (
              <ul className="hidden gap-4 text-sm text-[#eadfce]/74 md:flex md:items-center">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink', {
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(getLocalizedHref(locale, item.link.url) || '')
                            : false,
                      })}
                      appearance="nav"
                      locale={locale}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-4 md:w-1/3">
            <LanguageSwitcher locale={locale} />
            <Suspense fallback={<OpenCartButton locale={locale} />}>
              <Cart locale={locale} />
            </Suspense>
          </div>
        </div>
      </nav>
    </div>
  )
}
