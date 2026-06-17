import type { CollectionConfig } from 'payload'

import { Banner } from '@/blocks/Banner/config'
import { Carousel } from '@/blocks/Carousel/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { adminOnly } from '@/access/adminOnly'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { hero } from '@/fields/hero'
import { slugField } from 'payload'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: 'Страници',
    singular: 'Страница',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Съдържание',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      localized: true,
      type: 'text',
      label: 'Заглавие',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      label: 'Публикувано на',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'homeHeroBadge',
              type: 'text',
              localized: true,
              label: 'Малък текст над заглавието',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description:
                  'Кратък акцентен ред в най-горната част на началния екран.',
              },
            },
            {
              name: 'homeHeroTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Най-силното послание в началния екран.',
              },
              required: false,
            },
            {
              name: 'homeHeroBody',
              type: 'textarea',
              localized: true,
              label: 'Подзаглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Кратък текст под основното заглавие.',
              },
              required: false,
            },
            {
              name: 'homeHeroImage',
              type: 'upload',
              label: 'Основно изображение',
              relationTo: 'media',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Голямото фоново изображение в началния екран.',
              },
            },
            {
              name: 'homeHeroPrimaryCTA',
              type: 'text',
              localized: true,
              label: 'Текст на основния бутон',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Текст на бутона, който води към секцията за избор на вариант.',
              },
              required: false,
            },
            {
              name: 'homeHeroSecondaryCTA',
              type: 'text',
              localized: true,
              label: 'Текст на втория бутон',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Текст на бутона, който води към секцията с детайли.',
              },
              required: false,
            },
          ],
          label: 'Начален екран',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'Варианти',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeBuyBadge',
              type: 'text',
              localized: true,
              label: 'Малък текст над заглавието',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description:
                  'Кратък акцентен ред над секцията за избор на вариант и покупка.',
              },
            },
            {
              name: 'homeBuyTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Основното заглавие за секцията с избора на вариант.',
              },
              required: false,
            },
            {
              name: 'homeBuyBody',
              type: 'textarea',
              localized: true,
              label: 'Подзаглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Кратък текст под заглавието в секцията за покупка.',
              },
              required: false,
            },
          ],
          label: 'Избор и покупка',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'Материали',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'Галерия',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'Предимства',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'Доставка и доверие',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [],
          label: 'ЧЗВ',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            hero,
          ],
          label: 'Херо',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug !== 'home',
          },
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                Carousel,
                ThreeItemGrid,
                Banner,
                FormBlock,
              ],
              validate: (value, { siblingData }) => {
                if ((siblingData as { slug?: string } | undefined)?.slug === 'home') {
                  return true
                }

                if (Array.isArray(value) && value.length > 0) {
                  return true
                }

                return 'Тази страница изисква поне един content block.'
              },
            },
          ],
          label: 'Съдържание',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug !== 'home',
          },
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
