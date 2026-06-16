'use client'

import { useParams } from 'next/navigation'

import { normalizeLocale } from './routing'

export const useCurrentLocale = () => {
  const params = useParams<{ locale?: string }>()

  return normalizeLocale(params?.locale)
}
