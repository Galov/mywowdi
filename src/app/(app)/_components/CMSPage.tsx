import type { Metadata } from 'next'
import type { ContentLocale } from '@/i18n/config'

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

  return (
    <article className={hasHero || isHomePage ? 'pb-24' : 'pt-16 pb-24'}>
      {hero ? <RenderHero {...hero} locale={locale} /> : null}
      {isHomePage ? <HomeStorefront heroImage={homeHeroImage} locale={locale} /> : null}
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

  return result.docs?.[0] || null
}
