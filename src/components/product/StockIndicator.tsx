'use client'
import type { ContentLocale } from '@/i18n/config'
import { Product, Variant } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
  className?: string
  locale?: ContentLocale
  product: Product
  tone?: 'dark' | 'light'
}

const stockCopy = {
  bg: {
    available: 'Създаден изцяло в Европа само с европейски материали и местни партньори',
    outOfStock: 'Изчерпан',
    ready: 'Доставка в цяла Европа',
  },
  default: {
    available: 'Designed in Europe with European materials and partners',
    outOfStock: 'Out of stock',
    ready: 'Delivery across Europe',
  },
}

export const StockIndicator: React.FC<Props> = ({
  className,
  locale,
  product,
  tone = 'light',
}) => {
  const searchParams = useSearchParams()
  const copy = locale === 'bg' ? stockCopy.bg : stockCopy.default

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')
      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const stockQuantity = useMemo(() => {
    if (product.enableVariants) {
      if (selectedVariant) {
        return selectedVariant.inventory || 0
      }
    }
    return product.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory])

  if (product.enableVariants && !selectedVariant) {
    return null
  }

  return (
    <div
      className={`${tone === 'dark' ? 'text-[#eadfce]/74' : 'text-primary/70'} text-sm leading-6 tracking-[0.02em] ${className ?? ''}`}
    >
      {stockQuantity > 0 && <p>{copy.available}</p>}
      {(stockQuantity === 0 || !stockQuantity) && <p>{copy.outOfStock}</p>}
    </div>
  )
}
