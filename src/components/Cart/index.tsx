import React from 'react'

import { CartModal } from './CartModal'
import type { ContentLocale } from '@/i18n/config'
import { Cart as CartType } from '@/payload-types'

export type CartItem = NonNullable<CartType['items']>[number]

export function Cart({ locale }: { locale: ContentLocale }) {
  return <CartModal locale={locale} />
}
