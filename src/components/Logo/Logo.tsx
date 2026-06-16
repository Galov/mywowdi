import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      alt="WOWDY logo"
      className="max-w-37.5 rounded-full"
      height={1024}
      src="/brand/wowdy-logo.jpg"
      width={1024}
    />
  )
}
