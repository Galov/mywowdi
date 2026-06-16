import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      alt="MYWOWDI logo"
      className="max-w-37.5 rounded-full"
      height={1024}
      src="/brand/wowdi-logo.jpg"
      width={1024}
    />
  )
}
