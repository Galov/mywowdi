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
          fields: [
            {
              name: 'homeMaterialsTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Основното заглавие в секцията за материалите.',
              },
              required: false,
            },
            {
              name: 'homeMaterialsItems',
              type: 'array',
              label: 'Материални акценти',
              minRows: 3,
              maxRows: 3,
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description:
                  'Трите акцента под заглавието. Всеки акцент има икона, кратко заглавие и кратък текст.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Икона',
                  defaultValue: 'leaf',
                  options: [
                    {
                      label: 'Лист',
                      value: 'leaf',
                    },
                    {
                      label: 'Концентрични кръгове',
                      value: 'rings',
                    },
                    {
                      label: 'Ръка',
                      value: 'hand',
                    },
                  ],
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  label: 'Заглавие',
                  required: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  label: 'Кратък текст',
                  required: true,
                },
              ],
            },
            {
              name: 'homeMaterialsImage',
              type: 'upload',
              label: 'Основно изображение',
              relationTo: 'media',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Голямото изображение вдясно в секцията за материалите.',
              },
            },
          ],
          label: 'Материали',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeGalleryTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Заглавието над галерийната лента.',
              },
              required: false,
            },
            {
              name: 'homeGalleryBody',
              type: 'textarea',
              localized: true,
              label: 'Кратък текст',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Кратък текст над галерията.',
              },
              required: false,
            },
            {
              name: 'homeGalleryImages',
              type: 'array',
              label: 'Изображения',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description:
                  'Избери точно тези изображения, които искаш да се показват в галерията.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  label: 'Изображение',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
          label: 'Галерия',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeBenefitsTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Основното заглавие в секцията за предимствата.',
              },
              required: false,
            },
            {
              name: 'homeBenefitsBody',
              type: 'textarea',
              localized: true,
              label: 'Кратък текст',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Краткият текст под заглавието.',
              },
              required: false,
            },
            {
              name: 'homeBenefitsItems',
              type: 'array',
              label: 'Предимства',
              minRows: 3,
              maxRows: 3,
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Трите акцента в долната част на секцията.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Икона',
                  defaultValue: 'circle',
                  options: [
                    {
                      label: 'Кръг',
                      value: 'circle',
                    },
                    {
                      label: 'Щит',
                      value: 'shield',
                    },
                    {
                      label: 'Безкрайност',
                      value: 'infinity',
                    },
                  ],
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  label: 'Заглавие',
                  required: true,
                },
              ],
            },
            {
              name: 'homeBenefitsImage',
              type: 'upload',
              label: 'Основно изображение',
              relationTo: 'media',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Голямото изображение вляво в секцията за предимствата.',
              },
            },
          ],
          label: 'Предимства',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeTrustTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Основното заглавие в секцията за доставка и доверие.',
              },
              required: false,
            },
            {
              name: 'homeTrustBody',
              type: 'textarea',
              localized: true,
              label: 'Кратък текст',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Краткото въведение вляво.',
              },
              required: false,
            },
            {
              name: 'homeTrustItems',
              type: 'array',
              label: 'Доверителни акценти',
              minRows: 3,
              maxRows: 3,
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Трите кратки акцента в средната колона.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  label: 'Заглавие',
                  required: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  label: 'Кратък текст',
                  required: true,
                },
              ],
            },
            {
              name: 'homeTrustNotesTitle',
              type: 'text',
              localized: true,
              label: 'Заглавие на практичната колона',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
              },
              required: false,
            },
            {
              name: 'homeTrustNotes',
              type: 'array',
              label: 'Практични бележки',
              minRows: 2,
              maxRows: 4,
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Кратки practically useful редове вдясно.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  label: 'Заглавие',
                  required: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  label: 'Кратък текст',
                  required: true,
                },
              ],
            },
          ],
          label: 'Доставка',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeFaqTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Основното заглавие на секцията с често задавани въпроси.',
              },
              required: false,
            },
            {
              name: 'homeFaqBody',
              type: 'textarea',
              localized: true,
              label: 'Кратък текст',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Кратък въвеждащ текст над списъка с въпроси.',
              },
              required: false,
            },
            {
              name: 'homeFaqItems',
              type: 'array',
              label: 'Въпроси',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
                description: 'Списъкът с въпроси и отговори.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  localized: true,
                  label: 'Въпрос',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  localized: true,
                  label: 'Отговор',
                  required: true,
                },
              ],
            },
          ],
          label: 'ЧЗВ',
          admin: {
            condition: (_data, siblingData) => siblingData?.slug === 'home',
          },
        },
        {
          fields: [
            {
              name: 'homeClosingEyebrow',
              type: 'text',
              localized: true,
              label: 'Малък текст над заглавието',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
              },
              required: false,
            },
            {
              name: 'homeClosingTitle',
              type: 'textarea',
              localized: true,
              label: 'Основно заглавие',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
              },
              required: false,
            },
            {
              name: 'homeClosingButton',
              type: 'text',
              localized: true,
              label: 'Текст на бутона',
              admin: {
                condition: (_data, siblingData) => siblingData?.slug === 'home',
              },
              required: false,
            },
          ],
          label: 'Финален акцент',
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
