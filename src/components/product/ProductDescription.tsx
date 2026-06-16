'use client'
import type { ContentLocale } from '@/i18n/config'
import type { Product, Variant } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'

import { VariantSelector } from './VariantSelector'
import { StockIndicator } from '@/components/product/StockIndicator'

const productCopy = {
  bg: {
    chooseVariant: 'Избери вариант',
    shippingLabel: ['Естествени материали. Тих допир.', 'Доставка в цяла Европа.'],
    startsFrom: 'Цена',
  },
  default: {
    chooseVariant: 'Choose your finish',
    shippingLabel: ['Natural materials. Quiet tactility.', 'European delivery.'],
    startsFrom: 'Price',
  },
}

export function ProductDescription({
  locale,
  product,
}: {
  locale: ContentLocale
  product: Product
}) {
  const copy = locale === 'bg' ? productCopy.bg : productCopy.default
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = 'priceInEUR' as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const priceField = 'priceInEUR' as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="space-y-4">
        <p className="text-[0.7rem] uppercase tracking-[0.26em] text-primary/55">
          {copy.shippingLabel[0]}
          <br />
          {copy.shippingLabel[1]}
        </p>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl leading-[0.98] tracking-[-0.03em] text-primary md:text-5xl">
            {product.title}
          </h1>
          <div>
            <p className="mb-1 text-[0.68rem] uppercase tracking-[0.24em] text-primary/45">
              {copy.startsFrom}
            </p>
            <div className="text-xl text-primary md:text-2xl">
              {hasVariants ? (
                <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
              ) : (
                <Price amount={amount} />
              )}
            </div>
          </div>
        </div>
      </div>

      {product.description ? (
        <RichText
          className="max-w-none text-[0.98rem] leading-7 text-primary/78 [&_p]:max-w-xl"
          data={product.description}
          enableGutter={false}
          enableProse={false}
        />
      ) : null}

      {hasVariants && (
        <div className="space-y-4 border-y border-border/80 py-6">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-primary/45">
            {copy.chooseVariant}
          </p>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>
        </div>
      )}

      <div className="space-y-5 rounded-[1.75rem] bg-secondary/75 p-5">
        <div className="flex items-center justify-between gap-4">
          <Suspense fallback={null}>
            <StockIndicator locale={locale} product={product} />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <AddToCart locale={locale} product={product} />
        </Suspense>
      </div>
    </div>
  )
}
