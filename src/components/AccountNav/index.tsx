'use client'

import { Button } from '@/components/ui/button'
import { getLocalizedHref, stripLocaleFromPathname } from '@/i18n/routing'
import { useCurrentLocale } from '@/i18n/useCurrentLocale'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const locale = useCurrentLocale()
  const pathname = usePathname()
  const normalizedPathname = stripLocaleFromPathname(pathname)

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Button asChild variant="link">
            <Link
              href={getLocalizedHref(locale, '/account')}
              className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
                'text-primary': normalizedPathname === '/account',
              })}
            >
              Account settings
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="link">
            <Link
              href={getLocalizedHref(locale, '/account/addresses')}
              className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
                'text-primary': normalizedPathname === '/account/addresses',
              })}
            >
              Addresses
            </Link>
          </Button>
        </li>

        <li>
          <Button
            asChild
            variant="link"
            className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
              'text-primary':
                normalizedPathname === '/orders' || normalizedPathname.includes('/orders'),
            })}
          >
            <Link href={getLocalizedHref(locale, '/orders')}>Orders</Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-white/5" />

      <Button
        asChild
        variant="link"
        className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
          'text-primary': normalizedPathname === '/logout',
        })}
      >
        <Link href={getLocalizedHref(locale, '/logout')}>Log out</Link>
      </Button>
    </div>
  )
}
