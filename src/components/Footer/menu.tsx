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
    <nav>
      <ul>
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink appearance="link" {...item.link} locale={locale} />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
