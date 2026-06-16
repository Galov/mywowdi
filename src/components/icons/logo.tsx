import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

type Props = {
  alt?: string
  className?: string
  priority?: boolean
}

export function LogoIcon({ alt = 'MYWOWDI logo', className, priority = false }: Props) {
  return (
    <Image
      alt={alt}
      aria-label={alt}
      className={clsx('h-auto w-10 rounded-full object-cover', className)}
      height={1024}
      priority={priority}
      src="/brand/wowdi-logo.jpg"
      width={1024}
    />
  )
}
