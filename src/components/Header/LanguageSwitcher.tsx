'use client'

import { type ContentLocale } from '@/i18n/config'
import { getLocalizedHref, stripLocaleFromPathname } from '@/i18n/routing'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  locale: ContentLocale
}

const visibleLocales = [
  { code: 'bg', label: 'БГ' },
  { code: 'en', label: 'EN' },
] as const satisfies Array<{ code: ContentLocale; label: string }>

export function LanguageSwitcher({ className, locale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const basePathname = stripLocaleFromPathname(pathname || '/')
  const queryString = searchParams.toString()
  const hrefWithQuery = queryString ? `${basePathname}?${queryString}` : basePathname

  return (
    <Select
      onValueChange={(nextLocale) => {
        router.push(getLocalizedHref(nextLocale as ContentLocale, hrefWithQuery) || '/')
      }}
      value={locale}
    >
      <SelectTrigger
        className={`mb-0 h-9 w-auto min-w-0 rounded-full border-white/10 bg-[#241916] px-3 text-xs uppercase tracking-[0.18em] text-[#f2e7da] shadow-none [&_svg]:text-[#f2e7da] ${className || ''}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-white/10 bg-[#1b120f] text-[#f2e7da]">
        {visibleLocales.map(({ code, label }) => (
          <SelectItem
            className="text-xs uppercase tracking-[0.14em] text-[#f2e7da] focus:bg-white/10 focus:text-[#fff8ef]"
            key={code}
            value={code}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
