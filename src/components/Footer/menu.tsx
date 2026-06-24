import type { Footer } from '@/payload-types'
import type { ContentLocale } from '@/i18n/config'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  locale: ContentLocale
  menu: Footer['navItems']
}

export function FooterMenu({ locale, menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav className="md:pt-1">
      <ul className="flex flex-col gap-3">
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink
                {...item.link}
                appearance="inline"
                className="text-sm leading-6 text-[#d8c8b7]/74 transition-colors hover:text-[#fbf5ec]"
                locale={locale}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
