import type { Metadata } from 'next'
import type { ContentLocale } from '@/i18n/config'
import type { Media as MediaType, Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { HomeStorefront } from './HomeStorefront'
import { RenderHero } from '@/heros/RenderHero'
import { defaultLocale } from '@/i18n/config'
import { resolveLocale } from '@/i18n/routing'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import { notFound } from 'next/navigation'

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

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export async function generateCMSPageStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return (
    pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home'
      })
      .map(({ slug }) => {
        return { slug }
      }) ?? []
  )
}

export async function CMSPage({ params }: Args) {
  const locale = await resolveLocale(params)
  const { slug = 'home' } = await params

  const page = await queryPageBySlug({
    locale,
    slug,
  })

  if (!page) {
    return notFound()
  }

  const hero = page?.hero
  const layout = page?.layout
  const isHomePage = slug === 'home'
  const hasHero = Boolean(hero && hero.type && hero.type !== 'none')
  const homeHeroImage =
    page?.homeHeroImage && typeof page.homeHeroImage === 'object' ? page.homeHeroImage : undefined
  const homeHeroContent: HomeHeroContent | undefined = isHomePage
    ? {
        badge: page?.homeHeroBadge,
        body: page?.homeHeroBody,
        image: homeHeroImage,
        primaryCTA: page?.homeHeroPrimaryCTA,
        secondaryCTA: page?.homeHeroSecondaryCTA,
        title: page?.homeHeroTitle,
      }
    : undefined
  const homeBuyContent: HomeBuyContent | undefined = isHomePage
    ? {
        badge: page?.homeBuyBadge,
        body: page?.homeBuyBody,
        title: page?.homeBuyTitle,
      }
    : undefined
  const homeMaterialsImage =
    page?.homeMaterialsImage && typeof page.homeMaterialsImage === 'object'
      ? page.homeMaterialsImage
      : undefined
  const homeMaterialsContent: HomeMaterialsContent | undefined = isHomePage
    ? {
        image: homeMaterialsImage,
        items: page?.homeMaterialsItems as HomeMaterialsItem[] | null | undefined,
        title: page?.homeMaterialsTitle,
      }
    : undefined
  const homeGalleryContent: HomeGalleryContent | undefined = isHomePage
    ? {
        body: page?.homeGalleryBody,
        images:
          page?.homeGalleryImages
            ?.map((item) => (item?.image && typeof item.image === 'object' ? item.image : null))
            .filter((item): item is MediaType => Boolean(item)) || null,
        title: page?.homeGalleryTitle,
      }
    : undefined
  const homeBenefitsImage =
    page?.homeBenefitsImage && typeof page.homeBenefitsImage === 'object'
      ? page.homeBenefitsImage
      : undefined
  const homeBenefitsContent: HomeBenefitsContent | undefined = isHomePage
    ? {
        body: page?.homeBenefitsBody,
        image: homeBenefitsImage,
        items: page?.homeBenefitsItems as HomeBenefitsItem[] | null | undefined,
        title: page?.homeBenefitsTitle,
      }
    : undefined
  const homeTrustContent: HomeTrustContent | undefined = isHomePage
    ? {
        body: page?.homeTrustBody,
        items: page?.homeTrustItems as HomeTrustItem[] | null | undefined,
        notes: page?.homeTrustNotes as HomeTrustItem[] | null | undefined,
        notesTitle: page?.homeTrustNotesTitle,
        title: page?.homeTrustTitle,
      }
    : undefined
  const homeFaqContent: HomeFaqContent | undefined = isHomePage
    ? {
        body: page?.homeFaqBody,
        items: page?.homeFaqItems as HomeFaqItem[] | null | undefined,
        title: page?.homeFaqTitle,
      }
    : undefined
  const homeClosingContent: HomeClosingContent | undefined = isHomePage
    ? {
        button: page?.homeClosingButton,
        eyebrow: page?.homeClosingEyebrow,
        title: page?.homeClosingTitle,
      }
    : undefined

  return (
    <article className={isHomePage ? '' : hasHero ? 'pb-24' : 'pt-16 pb-24'}>
      {hero ? <RenderHero {...hero} locale={locale} /> : null}
      {isHomePage ? (
        <HomeStorefront
          benefitsContent={homeBenefitsContent}
          buyContent={homeBuyContent}
          closingContent={homeClosingContent}
          faqContent={homeFaqContent}
          galleryContent={homeGalleryContent}
          heroContent={homeHeroContent}
          materialsContent={homeMaterialsContent}
          trustContent={homeTrustContent}
          locale={locale}
        />
      ) : null}
      {layout?.length ? <RenderBlocks blocks={layout} locale={locale} /> : null}
    </article>
  )
}

export async function generateCMSPageMetadata({ params }: Args): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug = 'home' } = await params

  const page = await queryPageBySlug({
    locale,
    slug,
  })

  if (!page) {
    return {}
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({
  locale = defaultLocale,
  slug,
}: {
  locale?: ContentLocale
  slug: string
}) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return (result.docs?.[0] as Page | undefined) || null
}
