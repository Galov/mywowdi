'use client'

import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

type GalleryItem = NonNullable<Product['gallery']>[number]

type Props = {
  fallbackImage?: MediaType | null
  gallery: GalleryItem[]
}

export const HomeBuyVisual: React.FC<Props> = ({ fallbackImage = null, gallery }) => {
  const searchParams = useSearchParams()

  const selectedImage = useMemo(() => {
    const values = Array.from(searchParams.values())

    if (values.length > 0) {
      const imageVariant = gallery.find((item) => {
        if (!item.variantOption) return false

        const variantOptionID =
          typeof item.variantOption === 'object' ? item.variantOption.id : item.variantOption

        return values.some((value) => value === String(variantOptionID))
      })

      if (imageVariant && typeof imageVariant.image === 'object') {
        return imageVariant.image
      }
    }

    const firstGalleryImage =
      gallery[0] && typeof gallery[0].image === 'object' ? gallery[0].image : null

    return firstGalleryImage || fallbackImage
  }, [fallbackImage, gallery, searchParams])

  const [displayImage, setDisplayImage] = useState<MediaType | null>(selectedImage)
  const [previousImage, setPreviousImage] = useState<MediaType | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!selectedImage) {
      setDisplayImage(null)
      setPreviousImage(null)
      setIsTransitioning(false)
      return
    }

    if (!displayImage || displayImage.id === selectedImage.id) {
      setDisplayImage(selectedImage)
      return
    }

    setPreviousImage(displayImage)
    setDisplayImage(selectedImage)
    setIsTransitioning(true)

    const timeout = window.setTimeout(() => {
      setPreviousImage(null)
      setIsTransitioning(false)
    }, 520)

    return () => window.clearTimeout(timeout)
  }, [displayImage, selectedImage])

  if (!displayImage) {
    return null
  }

  return (
    <div className="relative aspect-[1/0.92] md:aspect-[1/1] lg:h-full lg:aspect-auto">
      {previousImage ? (
        <div
          className={`absolute inset-0 ${isTransitioning ? 'animate-[home-buy-visual-fade-out_260ms_ease-out_forwards]' : ''}`}
          key={`previous-${previousImage.id}`}
        >
          <Media
            fill
            priority
            resource={previousImage}
            size="(min-width: 1024px) 28vw, 100vw"
            imgClassName="object-cover object-center"
          />
        </div>
      ) : null}
      <div
        className={`absolute inset-0 ${isTransitioning ? 'animate-[home-buy-visual-fade-in_520ms_cubic-bezier(0.22,1,0.36,1)]' : ''}`}
        key={`current-${displayImage.id}`}
      >
        <Media
          fill
          priority
          resource={displayImage}
          size="(min-width: 1024px) 28vw, 100vw"
          imgClassName="object-cover object-center"
        />
      </div>
    </div>
  )
}
