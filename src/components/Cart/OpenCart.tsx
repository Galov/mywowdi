import type { ContentLocale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

const cartLabel = {
  bg: 'Количка',
  default: 'Cart',
}

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
  const label = locale === 'bg' ? cartLabel.bg : cartLabel.default

  return (
    <Button
      variant="nav"
      size="clear"
      className="navLink relative items-end hover:cursor-pointer"
      {...rest}
    >
      <span>{label}</span>

      {quantity ? (
        <>
          <span>•</span>
          <span>{quantity}</span>
        </>
      ) : null}
    </Button>
  )
}
