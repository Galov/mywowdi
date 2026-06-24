'use client'

import type { Page, Product } from '@/payload-types'
import type { ContentLocale } from '@/i18n/config'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { getLocalizedHref } from '@/i18n/routing'
import { useCurrentLocale } from '@/i18n/useCurrentLocale'
import Link from 'next/link'
import React from 'react'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  locale?: ContentLocale
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'products'
    value: Page | Product | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    locale,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const currentLocale = useCurrentLocale()
  const resolvedLocale = locale || currentLocale
  const fallbackLabel =
    label ||
    (typeof reference?.value === 'object' && 'title' in reference.value
      ? reference.value.title || null
      : null)

  const rawHref =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  const href = getLocalizedHref(resolvedLocale, rawHref)

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {fallbackLabel && fallbackLabel}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {fallbackLabel && fallbackLabel}
        {children && children}
      </Link>
    </Button>
  )
}
