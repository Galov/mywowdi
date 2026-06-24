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

const accountNavCopy = {
  bg: {
    accountSettings: 'Настройки на акаунта',
    addresses: 'Адреси',
    logOut: 'Изход',
    orders: 'Поръчки',
  },
  de: {
    accountSettings: 'Kontoeinstellungen',
    addresses: 'Adressen',
    logOut: 'Abmelden',
    orders: 'Bestellungen',
  },
  en: {
    accountSettings: 'Account settings',
    addresses: 'Addresses',
    logOut: 'Log out',
    orders: 'Orders',
  },
  es: {
    accountSettings: 'Configuracion de la cuenta',
    addresses: 'Direcciones',
    logOut: 'Cerrar sesion',
    orders: 'Pedidos',
  },
  fr: {
    accountSettings: 'Parametres du compte',
    addresses: 'Adresses',
    logOut: 'Se deconnecter',
    orders: 'Commandes',
  },
  it: {
    accountSettings: 'Impostazioni account',
    addresses: 'Indirizzi',
    logOut: 'Esci',
    orders: 'Ordini',
  },
} as const

export const AccountNav: React.FC<Props> = ({ className }) => {
  const locale = useCurrentLocale()
  const copy = accountNavCopy[locale] ?? accountNavCopy.en
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
              {copy.accountSettings}
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
              {copy.addresses}
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
            <Link href={getLocalizedHref(locale, '/orders')}>{copy.orders}</Link>
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
        <Link href={getLocalizedHref(locale, '/logout')}>{copy.logOut}</Link>
      </Button>
    </div>
  )
}
