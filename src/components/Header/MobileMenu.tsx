'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import type { ContentLocale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'

interface Props {
  locale: ContentLocale
  menu: Header['navItems']
}

const mobileMenuCopy = {
  bg: {
    account: 'Моят акаунт',
    addresses: 'Адреси',
    createAccount: 'Създайте акаунт',
    logIn: 'Вход',
    logOut: 'Изход',
    manageAccount: 'Управление на акаунта',
    or: 'или',
    orders: 'Поръчки',
  },
  de: {
    account: 'Mein Konto',
    addresses: 'Adressen',
    createAccount: 'Konto erstellen',
    logIn: 'Anmelden',
    logOut: 'Abmelden',
    manageAccount: 'Konto verwalten',
    or: 'oder',
    orders: 'Bestellungen',
  },
  en: {
    account: 'My account',
    addresses: 'Addresses',
    createAccount: 'Create an account',
    logIn: 'Log in',
    logOut: 'Log out',
    manageAccount: 'Manage account',
    or: 'or',
    orders: 'Orders',
  },
  es: {
    account: 'Mi cuenta',
    addresses: 'Direcciones',
    createAccount: 'Crear una cuenta',
    logIn: 'Iniciar sesion',
    logOut: 'Cerrar sesion',
    manageAccount: 'Gestionar cuenta',
    or: 'o',
    orders: 'Pedidos',
  },
  fr: {
    account: 'Mon compte',
    addresses: 'Adresses',
    createAccount: 'Creer un compte',
    logIn: 'Se connecter',
    logOut: 'Se deconnecter',
    manageAccount: 'Gerer le compte',
    or: 'ou',
    orders: 'Commandes',
  },
  it: {
    account: 'Il mio account',
    addresses: 'Indirizzi',
    createAccount: 'Crea un account',
    logIn: 'Accedi',
    logOut: 'Esci',
    manageAccount: 'Gestisci account',
    or: 'oppure',
    orders: 'Ordini',
  },
} as const

export function MobileMenu({ locale, menu }: Props) {
  const { user } = useAuth()
  const copy = mobileMenuCopy[locale] ?? mobileMenuCopy.en

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative inline-flex h-6 w-6 items-center justify-center self-center p-0 text-[#eadfce] transition-opacity hover:opacity-80">
        <CircleUserRound className="h-[18px] w-[18px]" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="border-white/10 !bg-[#120c0a] px-4 text-[#f2e7da] shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
      >
        <SheetHeader className="px-0 pt-4 pb-0">
          <SheetTitle className="text-[#f2e7da]">MYWOWDI</SheetTitle>

          <SheetDescription />
        </SheetHeader>

        <div className="py-4">
          {menu?.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item) => (
                <li className="py-2" key={item.id}>
                  <CMSLink {...item.link} appearance="link" locale={locale} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mb-6">
          <LanguageSwitcher className="w-full justify-center" locale={locale} />
        </div>

        {user ? (
          <div className="mt-4">
            <h2 className="mb-4 text-xl text-[#f2e7da]">{copy.account}</h2>
            <hr className="my-2 border-white/10" />
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={getLocalizedHref(locale, '/orders')}>{copy.orders}</Link>
              </li>
              <li>
                <Link href={getLocalizedHref(locale, '/account/addresses')}>{copy.addresses}</Link>
              </li>
              <li>
                <Link href={getLocalizedHref(locale, '/account')}>{copy.manageAccount}</Link>
              </li>
              <li className="mt-6">
                <Button asChild variant="outline">
                  <Link href={getLocalizedHref(locale, '/logout')}>{copy.logOut}</Link>
                </Button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-xl text-[#f2e7da]">{copy.account}</h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button asChild className="w-full sm:flex-1" variant="outline">
                <Link href={getLocalizedHref(locale, '/login')}>{copy.logIn}</Link>
              </Button>
              <span className="text-center text-sm text-[#eadfce]/52 sm:text-base">{copy.or}</span>
              <Button asChild className="w-full sm:flex-1">
                <Link href={getLocalizedHref(locale, '/create-account')}>{copy.createAccount}</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
