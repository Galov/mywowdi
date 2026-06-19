'use client'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import React from 'react'

type Props = {
  images: MediaType[]
}

export const HomeGalleryCarousel: React.FC<Props> = ({ images }) => {
  if (!images.length) {
    return null
  }

  const frames = images.length > 1 ? [...images, ...images] : images

  return (
    <Carousel
      className="w-full"
      opts={{ align: 'start', dragFree: false, loop: images.length > 1 }}
      plugins={
        images.length > 1
          ? [
              AutoScroll({
                playOnInit: true,
                speed: 0.65,
                startDelay: 1200,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true,
              }),
            ]
          : []
      }
    >
      <CarouselContent className="-ml-2 md:-ml-3">
        {frames.map((image, index) => (
          <CarouselItem
            className="basis-[88%] pl-2 sm:basis-[72%] md:basis-[56%] md:pl-3 lg:basis-[46%] xl:basis-[42%]"
            key={`${image.id}-${index}`}
          >
            <div className="relative aspect-[1.28/1] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#130d0b]">
              <Media
                fill
                priority={index < 2}
                resource={image}
                size="(min-width: 1280px) 42vw, (min-width: 1024px) 46vw, (min-width: 768px) 56vw, 88vw"
                imgClassName="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,10,0.04)_0%,rgba(18,12,10,0)_32%,rgba(18,12,10,0.16)_100%)]" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
