'use client'

import { Button } from '@/components/ui/button'
import type { ContentLocale } from '@/i18n/config'
import type { Product } from '@/payload-types'

import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

function resolveSwatchColor(option: unknown, fallbackLabel: string) {
  if (option && typeof option === 'object' && 'swatchColor' in option) {
    const candidate = option.swatchColor

    if (typeof candidate === 'string' && /^#([0-9A-Fa-f]{6})$/.test(candidate)) {
      return candidate
    }
  }

  const normalized = fallbackLabel.trim().toLowerCase()

  if (
    normalized.includes('olive') ||
    normalized.includes('маслин') ||
    normalized.includes('green') ||
    normalized.includes('зел')
  ) {
    return '#68745B'
  }

  if (
    normalized.includes('walnut') ||
    normalized.includes('орех') ||
    normalized.includes('brown') ||
    normalized.includes('каф')
  ) {
    return '#6A4937'
  }

  if (normalized.includes('black') || normalized.includes('чер')) {
    return '#1D1714'
  }

  return '#A88A72'
}

export function VariantSelector({
  locale,
  product,
  tone = 'light',
}: {
  locale: ContentLocale
  product: Product
  tone?: 'dark' | 'light'
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) {
    return null
  }

  return variantTypes?.map((type) => {
    if (!type || typeof type !== 'object') {
      return <></>
    }

    const options = type.options?.docs

    if (!options || !Array.isArray(options) || !options.length) {
      return <></>
    }

    return (
      <dl className="space-y-1.5" key={type.id}>
        <dt
          className={clsx(
            'text-[0.72rem] font-medium uppercase tracking-[0.2em]',
            tone === 'dark' ? 'text-[#eadfce]/40' : 'text-primary/52',
          )}
        >
          {locale === 'bg' ? `Избери ${type.label}` : `Choose ${type.label}`}
        </dt>
        <dd className="space-y-2.5">
          <React.Fragment>
            {options?.map((option) => {
              if (!option || typeof option !== 'object') {
                return <></>
              }

              const optionID = option.id
              const optionKeyLowerCase = type.name

              // Base option params on current params so we can preserve any other param state in the url.
              const optionSearchParams = new URLSearchParams(searchParams.toString())

              // Remove image and variant ID from this search params so we can loop over it safely.
              optionSearchParams.delete('variant')
              optionSearchParams.delete('image')

              // Update the option params using the current option to reflect how the url *would* change,
              // if the option was clicked.
              optionSearchParams.set(optionKeyLowerCase, String(optionID))

              const currentOptions = Array.from(optionSearchParams.values())

              let isAvailableForSale = true

              // Find a matching variant
              if (variants) {
                const matchingVariant = variants
                  .filter((variant) => typeof variant === 'object')
                  .find((variant) => {
                    if (!variant.options || !Array.isArray(variant.options)) return false

                    // Check if all variant options match the current options in the URL
                    return variant.options.every((variantOption) => {
                      if (typeof variantOption !== 'object')
                        return currentOptions.includes(String(variantOption))

                      return currentOptions.includes(String(variantOption.id))
                    })
                  })

                if (matchingVariant) {
                  // If we found a matching variant, set the variant ID in the search params.
                  optionSearchParams.set('variant', String(matchingVariant.id))

                  if (matchingVariant.inventory && matchingVariant.inventory > 0) {
                    isAvailableForSale = true
                  } else {
                    isAvailableForSale = false
                  }
                }
              }

              const optionUrl = createUrl(pathname, optionSearchParams)

              // The option is active if it's in the url params.
              const isActive =
                Boolean(isAvailableForSale) &&
                searchParams.get(optionKeyLowerCase) === String(optionID)
              const optionDescription =
                'shortDescription' in option && typeof option.shortDescription === 'string'
                  ? option.shortDescription
                  : ''
              const swatchColor = resolveSwatchColor(option, option.label)

              return (
                <Button
                  variant={'ghost'}
                  size="clear"
                  aria-disabled={!isAvailableForSale}
                  className={clsx(
                    'min-h-[4.5rem] w-full overflow-hidden whitespace-normal rounded-[1rem] border px-4 py-3.5 text-left shadow-none',
                    tone === 'dark'
                      ? 'border-white/10 bg-white/[0.025] text-[#eadfce]/74 hover:bg-white/[0.05] hover:text-[#fbf5ec]'
                      : 'border-border/80 bg-card text-primary/64 hover:bg-card',
                    {
                      'border-primary/35 bg-primary/8 text-primary hover:bg-primary/10':
                        isActive && tone === 'light',
                      'border-[#c8a989]/55 bg-[#c8a989]/10 text-[#fbf5ec] hover:bg-[#c8a989]/14 hover:text-[#fbf5ec]':
                        isActive && tone === 'dark',
                      'opacity-45': !isAvailableForSale,
                    },
                  )}
                  disabled={!isAvailableForSale}
                  key={option.id}
                  onClick={() => {
                    router.replace(`${optionUrl}`, {
                      scroll: false,
                    })
                  }}
                  title={`${option.label} ${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                >
                  <span className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5">
                    <span
                      className={clsx(
                        'mt-[0.28rem] size-3 shrink-0 rounded-full ring-1',
                        tone === 'dark' ? 'ring-white/18' : 'ring-black/10',
                      )}
                      style={{ backgroundColor: swatchColor }}
                    />
                    <span className="min-w-0 text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                      {option.label}
                    </span>
                    <span
                      className={clsx(
                        'mt-[0.28rem] size-2 shrink-0 rounded-full transition-opacity',
                        tone === 'dark' ? 'bg-[#c8a989]' : 'bg-primary',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {optionDescription ? (
                      <span
                        className={clsx(
                          'col-start-2 col-end-4 min-w-0 break-words pr-1 text-xs normal-case leading-5 tracking-[0.01em]',
                          tone === 'dark' ? 'text-[#eadfce]/54' : 'text-primary/50',
                        )}
                      >
                        {optionDescription}
                      </span>
                    ) : null}
                  </span>
                </Button>
              )
            })}
          </React.Fragment>
        </dd>
      </dl>
    )
  })
}
