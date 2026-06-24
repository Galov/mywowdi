import type { ContentLocale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { getCartCopy } from '@/components/checkout/copy'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  locale,
  quantity,
  ...rest
}: {
  className?: string
  locale?: ContentLocale
  quantity?: number
}) {
  const label = getCartCopy(locale || 'en').cart

  return (
    <Button
      variant="nav"
      size="clear"
      className="navLink relative inline-flex h-6 w-6 items-center justify-center self-center p-0 pt-0 pb-0 text-[#eadfce] hover:cursor-pointer hover:text-[#fbf5ec]"
      aria-label={label}
      title={label}
      {...rest}
    >
      <ShoppingCart className="size-5" />

      {quantity ? (
        <span className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#d7b894] px-1 text-[10px] font-medium leading-none text-[#120c0a]">
          {quantity}
        </span>
      ) : null}
    </Button>
  )
}
