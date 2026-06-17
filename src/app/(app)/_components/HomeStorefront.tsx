import type { Media as MediaType, Product } from '@/payload-types'
import type { ContentLocale } from '@/i18n/config'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
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
    materialEyebrow: 'Материали',
    materialTitle: 'Кожа, дърво и тихо движение вместо студен метал и пластмаса.',
    materialBody:
      'Продуктът е замислен като малък premium object. Той трябва да е топъл в ръката, спокоен в звука и естествен в стареенето си.',
    materialPoints: [
      'Естествена кожа с по-мек и топъл допир.',
      'Дървесни тонове и finishes, които стоят като личен аксесоар.',
      'Компактно присъствие без агресивна gadget естетика.',
    ],
    proofEyebrow: 'Защо работи',
    proofTitle: 'Не е играчка за разсейване. Това е малък ритуал за фокус.',
    proofBody:
      'Страницата не трябва да продава каталог. Тя трябва да покаже един предмет, който изглежда тих, стои красиво и се избира без излишно триене.',
    proofPoints: [
      'Една ясна страница вместо каталог от дребни решения.',
      'Вариантите се виждат на място с отделни снимки и текстура.',
      'Пътят до покупката остава кратък и ясен.',
    ],
    finalEyebrow: 'Когато си готов',
    finalTitle: 'Избери своя MYWOWDI и приключи с още едно шумно нещо на бюрото.',
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
    materialEyebrow: 'Materials',
    materialTitle: 'Leather, wood and quiet movement instead of cold metal and plastic.',
    materialBody:
      'The product is designed as a small premium object. It should feel warm in the hand, calm in sound and natural in how it ages.',
    materialPoints: [
      'Natural leather for a softer, warmer touch.',
      'Wood tones and finishes that read like a personal accessory.',
      'Compact presence without aggressive gadget aesthetics.',
    ],
    proofEyebrow: 'Why it works',
    proofTitle: 'Not a distraction toy. A small ritual for focus.',
    proofBody:
      'The page should not sell a catalog. It should present one object that looks calm, feels beautiful and can be chosen without friction.',
    proofPoints: [
      'One clear page instead of a fragmented catalog.',
      'Variants stay visible in place with their own imagery and finish.',
      'The path to purchase remains short and deliberate.',
    ],
    finalEyebrow: 'Ready when you are',
    finalTitle: 'Choose your MYWOWDI and replace one more noisy desk object with something quieter.',
  },
} as const

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          className="border-t border-border/80 pt-4 text-sm leading-6 text-primary/72 md:text-base"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export async function HomeStorefront({
  buyContent,
  heroContent,
  locale,
}: {
  buyContent?: HomeBuyContent
  heroContent?: HomeHeroContent
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
  const buyVisual = fallbackGallery[0]?.image || heroVisual

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70">
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
              <h1 className="font-display max-w-4xl text-5xl leading-[0.92] tracking-[-0.045em] text-white md:max-w-3xl md:text-[3.7rem] lg:text-[4.35rem]">
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
        className="bg-[radial-gradient(circle_at_top,rgba(74,49,35,0.38),transparent_42%),linear-gradient(180deg,#17100d_0%,#130d0b_100%)] py-12 md:py-18"
        id="buy"
      >
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
            <div className="max-w-md lg:sticky lg:top-24">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-[#c8a989]/68">
                {buyBadge}
              </p>
              <h2 className="font-display text-4xl leading-[0.96] tracking-[-0.04em] text-[#f5ede3] md:text-5xl">
                {buyTitle}
              </h2>
              <p className="mt-6 text-base leading-7 text-[#e4d6c6]/72 md:text-[1.02rem]">
                {buyBody}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(15rem,0.76fr)_minmax(21rem,0.92fr)] lg:items-stretch lg:gap-5">
              {buyVisual ? (
                <div className="order-2 overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#241813] lg:order-1 lg:min-h-[35rem]">
                  <div className="relative aspect-[1/0.92] md:aspect-[1/1] lg:h-full lg:aspect-auto">
                    <Media
                      fill
                      priority
                      resource={buyVisual}
                      size="(min-width: 1024px) 28vw, 100vw"
                      imgClassName="object-cover object-center"
                    />
                  </div>
                </div>
              ) : null}

              <div className="order-1 rounded-[1.75rem] border border-white/10 bg-[#221713] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] md:p-6 lg:order-2 lg:min-h-[35rem]">
                <ProductDescription
                  compact
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

      <section className="container grid gap-14 border-t border-border/80 py-16 md:grid-cols-2 md:gap-20 md:py-24" id="details">
        <div>
          <p className="mb-3 text-[0.72rem] uppercase tracking-[0.24em] text-primary/50">
            {copy.materialEyebrow}
          </p>
          <h3 className="font-display text-3xl leading-tight tracking-[-0.03em] text-primary md:text-5xl">
            {copy.materialTitle}
          </h3>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary/72 md:text-lg">
            {copy.materialBody}
          </p>
        </div>

        <FeatureList items={copy.materialPoints} />
      </section>

      <section className="container grid gap-14 border-t border-border/80 py-16 md:grid-cols-[0.95fr_1.05fr] md:gap-20 md:py-24">
        <div className="rounded-[2rem] bg-[#d8d4c8]/55 p-8 md:p-10">
          <p className="mb-3 text-[0.72rem] uppercase tracking-[0.24em] text-primary/50">
            {copy.proofEyebrow}
          </p>
          <h3 className="font-display text-3xl leading-tight tracking-[-0.03em] text-primary md:text-5xl">
            {copy.proofTitle}
          </h3>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary/72 md:text-lg">
            {copy.proofBody}
          </p>
        </div>

        <FeatureList items={copy.proofPoints} />
      </section>

      <section className="container border-t border-border/80 py-16 md:py-24">
        <div className="rounded-[2.25rem] bg-primary px-6 py-10 text-primary-foreground md:px-10 md:py-14">
          <p className="mb-3 text-[0.72rem] uppercase tracking-[0.24em] text-primary-foreground/62">
            {copy.finalEyebrow}
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="font-display max-w-3xl text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">
              {copy.finalTitle}
            </h3>
            <a
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary-foreground px-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary transition hover:opacity-90"
              href="#buy"
            >
              {copy.heroPrimary}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
