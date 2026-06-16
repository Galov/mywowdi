import type { ContentLocale } from '@/i18n/config'

import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header({ locale }: { locale: ContentLocale }) {
  const header = await getCachedGlobal('header', locale, 1)()

  return <HeaderClient header={header} locale={locale} />
}
