import type { Media as MediaType, Product } from '@/payload-types'
import type { ContentLocale } from '@/i18n/config'

import { Media } from '@/components/Media'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HomeGalleryCarousel } from '@/components/home/HomeGalleryCarousel'
import { Message } from '@/components/Message'
import { HomeBuyVisual } from '@/components/product/HomeBuyVisual'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Circle, Hand, Infinity, Leaf, Orbit, ShieldCheck } from 'lucide-react'
import React from 'react'

async function queryPrimaryProduct(locale: ContentLocale) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft: false,
    limit: 1,
    locale,
    overrideAccess: false,
    pagination: false,
    sort: 'title',
    where: {
      _status: {
        equals: 'published',
      },
    },
    populate: {
      variants: {
        title: true,
        priceInEUR: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}

type HomeHeroContent = {
  badge?: string | null
  body?: string | null
  image?: MediaType
  primaryCTA?: string | null
  secondaryCTA?: string | null
  title?: string | null
}

type HomeBuyContent = {
  badge?: string | null
  body?: string | null
  title?: string | null
}

type HomeMaterialsItem = {
  body?: string | null
  icon?: 'hand' | 'leaf' | 'rings' | null
  title?: string | null
}

type HomeMaterialsContent = {
  image?: MediaType
  items?: HomeMaterialsItem[] | null
  title?: string | null
}

type HomeGalleryContent = {
  body?: string | null
  images?: MediaType[] | null
  title?: string | null
}

type HomeBenefitsItem = {
  icon?: 'circle' | 'infinity' | 'shield' | null
  title?: string | null
}

type HomeBenefitsContent = {
  body?: string | null
  image?: MediaType
  items?: HomeBenefitsItem[] | null
  title?: string | null
}

type HomeTrustItem = {
  body?: string | null
  title?: string | null
}

type HomeTrustContent = {
  body?: string | null
  items?: HomeTrustItem[] | null
  notes?: HomeTrustItem[] | null
  notesTitle?: string | null
  title?: string | null
}

type HomeFaqItem = {
  answer?: string | null
  question?: string | null
}

type HomeFaqContent = {
  body?: string | null
  items?: HomeFaqItem[] | null
  title?: string | null
}

type HomeClosingContent = {
  button?: string | null
  eyebrow?: string | null
  title?: string | null
}

const storefrontCopy = {
  bg: {
    badge: 'Спокойствие в ръката',
    eyebrow: 'Натурална антистрес играчка',
    heroTitle: 'Тих обект за ръката. Повече спокойствие, по-малко шум.',
    heroBody:
      'MYWOWDI съчетава естествена кожа, дърво и плътен тактилен отговор в малък предмет, който стои спокойно и красиво до теб.',
    heroPrimary: 'Избери вариант',
    heroSecondary: 'Виж детайлите',
    buyEyebrow: 'Избери своя MYWOWDI',
    buyTitle: 'Един продукт. Няколко характера.',
    buyBody:
      'Изборът е прост - материал, тон и усещане. Всяка версия запазва една и съща тиха идея, но носи различно присъствие.',
    materialTitle: 'Материали, които се усещат.',
    materialPoints: [
      {
        body: 'Мека на допир, устойчива във времето.',
        icon: 'leaf',
        title: 'Естествена кожа',
      },
      {
        body: 'Топло, стабилно, с естествен рисунък.',
        icon: 'rings',
        title: 'Истинско дърво',
      },
      {
        body: 'Плътен и тих клик, който фокусира ума.',
        icon: 'hand',
        title: 'Тактилен отговор',
      },
    ],
    benefitsTitle: 'Спокойствие, което носиш в джоба.',
    benefitsBody:
      'Дискретен във форма и присъствие. Създаден да бъде с теб навсякъде.',
    benefitsPoints: [
      {
        icon: 'circle',
        title: 'Компактен',
      },
      {
        icon: 'shield',
        title: 'Издръжлив',
      },
      {
        icon: 'infinity',
        title: 'Вечен дизайн',
      },
    ],
  },
  default: {
    badge: 'Calm in your hand',
    eyebrow: 'Natural anti-stress object',
    heroTitle: 'A quiet object for your hand. More calm, less noise.',
    heroBody:
      'MYWOWDI combines natural leather, wood and tactile resistance in a small object you genuinely want to keep close.',
    heroPrimary: 'Choose your finish',
    heroSecondary: 'See the details',
    buyEyebrow: 'Choose your MYWOWDI',
    buyTitle: 'One product. Several characters.',
    buyBody:
      'The choice stays simple: material, tone and presence. Every version keeps the same calm idea while carrying a different mood.',
    materialTitle: 'Materials you can feel.',
    materialPoints: [
      {
        body: 'Soft to the touch, durable over time.',
        icon: 'leaf',
        title: 'Natural leather',
      },
      {
        body: 'Warm, stable, with a natural grain.',
        icon: 'rings',
        title: 'Real wood',
      },
      {
        body: 'A dense and quiet click that helps focus.',
        icon: 'hand',
        title: 'Tactile response',
      },
    ],
    benefitsTitle: 'Calm you can carry in your pocket.',
    benefitsBody:
      'Discrete in form and presence. Designed to stay with you wherever you go.',
    benefitsPoints: [
      {
        icon: 'circle',
        title: 'Compact',
      },
      {
        icon: 'shield',
        title: 'Durable',
      },
      {
        icon: 'infinity',
        title: 'Timeless design',
      },
    ],
  },
} as const

function MaterialIcon({ icon }: { icon?: 'hand' | 'leaf' | 'rings' | null }) {
  const className = 'h-8 w-8 stroke-[1.5] text-[#d7b899]'

  if (icon === 'hand') {
    return <Hand className={className} />
  }

  if (icon === 'rings') {
    return <Orbit className={className} />
  }

  return <Leaf className={className} />
}

function MaterialFeatureList({ items }: { items: readonly HomeMaterialsItem[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
      {items.map((item, index) => (
        <article className="max-w-[14rem]" key={`${item.title || 'item'}-${index}`}>
          <div className="mb-5">
            <MaterialIcon icon={item.icon} />
          </div>
          <h4 className="text-[1.05rem] leading-6 text-[#f2e7da]">{item.title}</h4>
          <p className="mt-3 text-[0.98rem] leading-7 text-[#d8c8b7]/74">{item.body}</p>
        </article>
      ))}
    </div>
  )
}

function BenefitIcon({ icon }: { icon?: 'circle' | 'infinity' | 'shield' | null }) {
  const className = 'h-8 w-8 stroke-[1.5] text-[#d7b899]'

  if (icon === 'shield') {
    return <ShieldCheck className={className} />
  }

  if (icon === 'infinity') {
    return <Infinity className={className} />
  }

  return <Circle className={className} />
}

function BenefitFeatureList({ items }: { items: readonly HomeBenefitsItem[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
      {items.map((item, index) => (
        <article className="max-w-[12rem]" key={`${item.title || 'item'}-${index}`}>
          <div className="mb-5">
            <BenefitIcon icon={item.icon} />
          </div>
          <h4 className="text-[1.05rem] leading-6 text-[#f2e7da]">{item.title}</h4>
        </article>
      ))}
    </div>
  )
}

export async function HomeStorefront({
  benefitsContent,
  buyContent,
  closingContent,
  faqContent,
  galleryContent,
  heroContent,
  materialsContent,
  trustContent,
  locale,
}: {
  benefitsContent?: HomeBenefitsContent
  buyContent?: HomeBuyContent
  closingContent?: HomeClosingContent
  faqContent?: HomeFaqContent
  galleryContent?: HomeGalleryContent
  heroContent?: HomeHeroContent
  materialsContent?: HomeMaterialsContent
  trustContent?: HomeTrustContent
  locale: ContentLocale
}) {
  const product = await queryPrimaryProduct(locale)
  const copy = locale === 'bg' ? storefrontCopy.bg : storefrontCopy.default

  if (!product) {
    return (
      <section className="container py-10 md:py-16">
        <Message warning="Все още няма публикуван продукт. Добави първия MYWOWDI продукт в админ панела, за да се появи storefront секцията тук." />
      </section>
    )
  }

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta.image : null
  const fallbackGallery =
    gallery.length > 0 || !metaImage
      ? gallery
      : [
          {
            id: `meta-${product.id}`,
            image: metaImage,
            variantOption: null,
          },
        ]

  const heroVisual = heroContent?.image || fallbackGallery[0]?.image
  const heroBadge = heroContent?.badge || copy.badge
  const heroTitle = heroContent?.title || copy.heroTitle
  const heroBody = heroContent?.body || copy.heroBody
  const heroPrimaryCTA = heroContent?.primaryCTA || copy.heroPrimary
  const heroSecondaryCTA = heroContent?.secondaryCTA || copy.heroSecondary
  const buyBadge = buyContent?.badge || copy.buyEyebrow
  const buyTitle = buyContent?.title || copy.buyTitle
  const buyBody = buyContent?.body || copy.buyBody
  const materialTitle = materialsContent?.title || copy.materialTitle
  const materialItems =
    materialsContent?.items?.filter(
      (item): item is HomeMaterialsItem => Boolean(item?.title || item?.body),
    ) || copy.materialPoints
  const materialImage =
    materialsContent?.image ||
    (typeof fallbackGallery[0]?.image === 'object' ? fallbackGallery[0].image : null)
  const galleryTitle = galleryContent?.title || null
  const galleryBody = galleryContent?.body || null
  const galleryFrames = galleryContent?.images || []
  const benefitsTitle = benefitsContent?.title || copy.benefitsTitle
  const benefitsBody = benefitsContent?.body || copy.benefitsBody
  const benefitsItems =
    benefitsContent?.items?.filter((item): item is HomeBenefitsItem => Boolean(item?.title)) ||
    copy.benefitsPoints
  const benefitsImage =
    benefitsContent?.image ||
    (typeof fallbackGallery[1]?.image === 'object'
      ? fallbackGallery[1].image
      : typeof fallbackGallery[0]?.image === 'object'
        ? fallbackGallery[0].image
        : null)
  const trustTitle = trustContent?.title || null
  const trustBody = trustContent?.body || null
  const trustItems =
    trustContent?.items?.filter((item): item is HomeTrustItem => Boolean(item?.title || item?.body)) ||
    []
  const trustNotesTitle = trustContent?.notesTitle || null
  const trustNotes =
    trustContent?.notes?.filter((item): item is HomeTrustItem => Boolean(item?.title || item?.body)) ||
    []
  const hasTrustSection = Boolean(
    trustTitle || trustBody || trustItems.length > 0 || trustNotesTitle || trustNotes.length > 0,
  )
  const faqTitle = faqContent?.title || null
  const faqBody = faqContent?.body || null
  const faqItems =
    faqContent?.items?.filter((item): item is HomeFaqItem => Boolean(item?.question || item?.answer)) ||
    []
  const hasFaqSection = Boolean(faqTitle || faqBody || faqItems.length > 0)
  const closingEyebrow = closingContent?.eyebrow || null
  const closingTitle = closingContent?.title || null
  const closingButton = closingContent?.button || heroPrimaryCTA
  const hasClosingSection = Boolean(closingEyebrow || closingTitle || closingButton)
  const buyVisual =
    typeof fallbackGallery[0]?.image === 'object'
      ? fallbackGallery[0].image
      : typeof heroVisual === 'object'
        ? heroVisual
        : null

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroVisual ? (
            <Media
              fill
              priority
              resource={heroVisual}
              size="100vw"
              imgClassName="object-cover object-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(21,18,16,0.82)_0%,rgba(21,18,16,0.68)_38%,rgba(21,18,16,0.18)_72%,rgba(247,242,233,0.18)_100%)]" />
        </div>

        <div className="relative min-h-[calc(100svh-5rem)]">
          <div className="container flex min-h-[calc(100svh-5rem)] items-center py-14 md:py-18">
            <div className="max-w-2xl">
              <p className="mb-6 text-[0.72rem] uppercase tracking-[0.28em] text-white/72 md:mb-8">
                {heroBadge}
              </p>
              <h1 className="font-display max-w-4xl text-5xl leading-[0.98] tracking-[-0.045em] text-white md:max-w-3xl md:text-[3.7rem] md:leading-[0.96] lg:text-[4.35rem]">
                {heroTitle}
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/78 md:mt-10 md:text-[1.05rem]">
                {heroBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 md:mt-10 sm:flex-row">
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#e8dcc5] px-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#231c16] transition hover:bg-[#f0e5d0]"
                  href="#buy"
                >
                  {heroPrimaryCTA}
                </a>
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/60 hover:bg-white/8"
                  href="#details"
                >
                  {heroSecondaryCTA}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[radial-gradient(circle_at_top,rgba(74,49,35,0.34),transparent_42%),linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-18 md:py-24"
        id="buy"
      >
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
            <div className="max-w-md lg:sticky lg:top-24">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[#c8a989]/68">
                {buyBadge}
              </p>
              <h2 className="font-display text-4xl leading-[1.02] tracking-[-0.04em] text-[#f5ede3] md:text-5xl md:leading-[0.98]">
                {buyTitle}
              </h2>
              <p className="mt-6 text-base leading-7 text-[#e4d6c6]/72 md:text-[1.02rem]">
                {buyBody}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(15rem,0.76fr)_minmax(21rem,0.92fr)] lg:items-stretch lg:gap-5">
              {buyVisual ? (
                <div className="order-1 hidden overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#241813] md:block lg:order-1 lg:min-h-[35rem]">
                  <HomeBuyVisual fallbackImage={buyVisual} gallery={fallbackGallery} />
                </div>
              ) : null}

              <div className="order-2 rounded-[1.75rem] border border-white/10 bg-[#221713] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] md:p-6 lg:order-2 lg:min-h-[35rem]">
                <ProductDescription
                  compact
                  galleryItems={fallbackGallery}
                  locale={locale}
                  product={product}
                  showDescription={false}
                  tone="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-10 md:py-24"
        id="details"
      >
        <div className="container">
          <div className="grid overflow-hidden md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="border-b border-white/10 px-6 py-12 md:border-b-0 md:px-10 md:py-14 lg:px-14 lg:py-16">
              <h3 className="font-display max-w-xl text-[2rem] leading-[1.12] tracking-[-0.035em] text-[#e8d7c4] md:text-[3rem] md:leading-[1.08]">
                {materialTitle}
              </h3>
              <div className="mt-10">
                <MaterialFeatureList items={materialItems} />
              </div>
            </div>

            <div className="relative min-h-[20rem] bg-[#16100d] md:min-h-[28rem]">
              {materialImage ? (
                <>
                  <Media
                    fill
                    resource={materialImage}
                    size="(min-width: 768px) 45vw, 100vw"
                    imgClassName="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(18,12,10,0.08)_66%,rgba(18,12,10,0.24)_78%,rgba(18,12,10,0.68)_89%,rgba(18,12,10,1)_100%),linear-gradient(90deg,rgba(18,12,10,0.94)_0%,rgba(18,12,10,0.24)_14%,rgba(18,12,10,0)_26%,rgba(18,12,10,0)_74%,rgba(18,12,10,0.24)_86%,rgba(18,12,10,0.94)_100%),linear-gradient(180deg,rgba(18,12,10,0.1)_0%,rgba(18,12,10,0.02)_16%,rgba(18,12,10,0)_38%,rgba(18,12,10,0)_68%,rgba(18,12,10,0.18)_88%,rgba(18,12,10,0.46)_100%)]" />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {galleryFrames.length > 0 ? (
        <section className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-12 md:py-28">
          <div className="container">
            {galleryTitle || galleryBody ? (
              <div className="mb-8 max-w-2xl md:mb-10">
                {galleryTitle ? (
                  <h3 className="font-display text-[2rem] leading-[1.12] tracking-[-0.035em] text-[#e8d7c4] md:text-[3rem] md:leading-[1.08]">
                    {galleryTitle}
                  </h3>
                ) : null}
                {galleryBody ? (
                  <p className="mt-5 max-w-xl text-[1rem] leading-7 text-[#d8c8b7]/72 md:text-[1.02rem]">
                    {galleryBody}
                  </p>
                ) : null}
              </div>
            ) : null}

            <HomeGalleryCarousel images={galleryFrames} />
          </div>
        </section>
      ) : null}

      <section className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-16 md:py-24">
        <div className="container">
          <div className="grid overflow-hidden md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="relative min-h-[20rem] bg-[#16100d] md:min-h-[28rem]">
              {benefitsImage ? (
                <>
                  <Media
                    fill
                    resource={benefitsImage}
                    size="(min-width: 768px) 45vw, 100vw"
                    imgClassName="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_52%,rgba(18,12,10,0.08)_68%,rgba(18,12,10,0.24)_80%,rgba(18,12,10,0.66)_90%,rgba(18,12,10,1)_100%),linear-gradient(90deg,rgba(18,12,10,0.96)_0%,rgba(18,12,10,0.2)_14%,rgba(18,12,10,0)_28%,rgba(18,12,10,0)_72%,rgba(18,12,10,0.24)_86%,rgba(18,12,10,0.96)_100%),linear-gradient(180deg,rgba(18,12,10,0.12)_0%,rgba(18,12,10,0.02)_18%,rgba(18,12,10,0)_38%,rgba(18,12,10,0)_68%,rgba(18,12,10,0.18)_88%,rgba(18,12,10,0.46)_100%)]" />
                </>
              ) : null}
            </div>

            <div className="border-b border-white/10 px-6 py-12 md:border-b-0 md:px-10 md:py-14 lg:px-14 lg:py-16">
              <h3 className="font-display max-w-xl text-[2rem] leading-[1.12] tracking-[-0.035em] text-[#e8d7c4] md:text-[3rem] md:leading-[1.08]">
                {benefitsTitle}
              </h3>
              {benefitsBody ? (
                <p className="mt-6 max-w-xl text-[1rem] leading-7 text-[#d8c8b7]/74 md:text-[1.02rem]">
                  {benefitsBody}
                </p>
              ) : null}
              <div className="mt-10">
                <BenefitFeatureList items={benefitsItems} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasTrustSection ? (
        <section className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-18 md:py-26">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] lg:gap-14">
              <div className="max-w-md">
                {trustTitle ? (
                  <h3 className="font-display max-w-sm text-[2rem] leading-[1.12] tracking-[-0.035em] text-[#e8d7c4] md:text-[3rem] md:leading-[1.08]">
                    {trustTitle}
                  </h3>
                ) : null}
                {trustBody ? (
                  <p className="mt-6 max-w-md text-[1rem] leading-7 text-[#d8c8b7]/74 md:text-[1.02rem]">
                    {trustBody}
                  </p>
                ) : null}
              </div>

              <div className="space-y-5">
                {trustItems.map((item, index) => (
                  <article
                    className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                    key={`${item.title || 'trust'}-${index}`}
                  >
                    <h4 className="text-[1.02rem] leading-6 text-[#f2e7da]">{item.title}</h4>
                    <p className="mt-2 max-w-sm text-[0.98rem] leading-7 text-[#d8c8b7]/72">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-white/3 p-6 md:p-7">
                {trustNotesTitle ? (
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#c8a989]/72">
                    {trustNotesTitle}
                  </p>
                ) : null}
                <div className={trustNotesTitle ? 'mt-6 space-y-5' : 'space-y-5'}>
                  {trustNotes.map((item, index) => (
                    <article
                      className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                      key={`${item.title || 'note'}-${index}`}
                    >
                      <h4 className="text-[1rem] leading-6 text-[#f2e7da]">{item.title}</h4>
                      <p className="mt-2 text-[0.96rem] leading-7 text-[#d8c8b7]/72">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hasFaqSection ? (
        <section className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-18 md:py-26">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
              <div className="max-w-md">
                {faqTitle ? (
                  <h3 className="font-display max-w-sm text-[2rem] leading-[1.12] tracking-[-0.035em] text-[#e8d7c4] md:text-[3rem] md:leading-[1.08]">
                    {faqTitle}
                  </h3>
                ) : null}
                {faqBody ? (
                  <p className="mt-6 max-w-md text-[1rem] leading-7 text-[#d8c8b7]/74 md:text-[1.02rem]">
                    {faqBody}
                  </p>
                ) : null}
              </div>

              <div className="rounded-[1.6rem] border border-white/8 bg-white/3 px-6 py-3 md:px-8 md:py-4">
                <Accordion className="w-full" collapsible type="single">
                  {faqItems.map((item, index) => (
                    <AccordionItem
                      className="border-white/10"
                      key={`${item.question || 'faq'}-${index}`}
                      value={`faq-${index}`}
                    >
                      <AccordionTrigger className="py-5 text-[1rem] leading-7 text-[#f2e7da] hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-[0.98rem] leading-7 text-[#d8c8b7]/72">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hasClosingSection ? (
        <section className="bg-[linear-gradient(180deg,#120c0a_0%,#1b130f_50%,#120c0a_100%)] py-18 md:py-26">
          <div className="container">
            <div className="rounded-[2.6rem] border border-[#2f221b] bg-[linear-gradient(180deg,#2b1d17_0%,#201611_100%)] px-6 py-10 text-[#f2e7da] shadow-[0_22px_60px_rgba(0,0,0,0.22)] md:px-10 md:py-14 lg:px-12">
              {closingEyebrow ? (
                <p className="mb-3 text-[0.72rem] uppercase tracking-[0.24em] text-[#c8a989]/72">
                  {closingEyebrow}
                </p>
              ) : null}
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {closingTitle ? (
                  <h3 className="font-display max-w-3xl text-3xl leading-[1.14] tracking-[-0.03em] md:text-5xl md:leading-[1.08]">
                    {closingTitle}
                  </h3>
                ) : <div />}
                {closingButton ? (
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#e8dcc5] px-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#231c16] transition hover:bg-[#f0e5d0]"
                    href="#buy"
                  >
                    {closingButton}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
