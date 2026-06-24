import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Field, Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin, EUR } from '@payloadcms/plugin-ecommerce'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Product } from '@/payload-types'
import { buildFormSubmissionEmail, getFormSubmissionSubject } from '@/utilities/email/templates'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { normalizeLocale } from '@/i18n/routing'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'

const stripeKeys = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
}

const stripeEnabled = Object.values(stripeKeys).every((value) => value)

const adminFieldLabels: Record<string, string> = {
  amount: 'Сума',
  billingAddress: 'Адрес за фактуриране',
  cart: 'Количка',
  country: 'Държава',
  createdAt: 'Създадена на',
  currency: 'Валута',
  customer: 'Клиент',
  customerEmail: 'Имейл на клиента',
  firstName: 'Име',
  inventory: 'Наличност',
  items: 'Артикули',
  label: 'Етикет',
  lastName: 'Фамилия',
  name: 'Име',
  options: 'Опции на варианта',
  order: 'Поръчка',
  paymentMethod: 'Метод на плащане',
  postalCode: 'Пощенски код',
  product: 'Продукт',
  purchasedAt: 'Закупена на',
  shippingAddress: 'Адрес за доставка',
  state: 'Област / регион',
  status: 'Статус',
  subtotal: 'Междинна сума',
  title: 'Заглавие',
  transactions: 'Транзакции',
  value: 'Стойност',
  variantType: 'Тип вариант',
}

const selectOptionLabels: Record<string, Record<string, string>> = {
  status: {
    abandoned: 'Изоставена',
    active: 'Активна',
    cancelled: 'Отказана',
    completed: 'Завършена',
    processing: 'Обработва се',
    purchased: 'Закупена',
    refunded: 'Възстановена',
  },
}

const collectionOrder = [
  'products',
  'variantTypes',
  'variantOptions',
  'variants',
  'inquiries',
  'orders',
  'transactions',
  'carts',
  'addresses',
  'pages',
  'categories',
  'media',
  'forms',
  'form-submissions',
  'users',
] as const

const collectionOrderIndex = new Map<string, number>(collectionOrder.map((slug, index) => [slug, index]))

const escapeHTML = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const prettifySubmissionFieldName = (field?: string) => {
  if (!field) return ''

  const knownLabels: Record<string, string> = {
    email: 'Имейл',
    firstName: 'Име',
    lastName: 'Фамилия',
    message: 'Съобщение',
    name: 'Име',
    phone: 'Телефон',
    subject: 'Тема',
  }

  if (knownLabels[field]) {
    return knownLabels[field]
  }

  const normalized = field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .trim()

  if (!normalized) return field

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const buildSubmissionTableHTML = (
  submissionData: Array<{ field?: string; value?: unknown }> = [],
) => {
  const rows = submissionData
    .filter((item) => item?.field)
    .map((item) => {
      const label = prettifySubmissionFieldName(item.field)
      const rawValue = String(item.value ?? '').trim()
      const value = escapeHTML(rawValue).replaceAll('\n', '<br />')
      const isLong =
        rawValue.length > 120 ||
        rawValue.includes('\n') ||
        ['message', 'notes', 'comment', 'comments'].includes(String(item.field).toLowerCase())

      return `
        <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
          <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
            ${escapeHTML(label)}
          </div>
          <div style="font-size:${isLong ? '15px' : '16px'};line-height:${isLong ? '1.75' : '1.6'};color:#f4e8da;">
            ${value || '<span style="color:#cdb39a;">-</span>'}
          </div>
        </div>
      `
    })
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;">
      ${rows}
    </div>
  `
}

const isDefaultEnglishFormSubject = (subject?: string) => {
  if (!subject) return true

  const normalized = subject.trim().toLowerCase()

  return (
    normalized === "you've received a new message." ||
    normalized === 'you have received a new message.' ||
    normalized === 'you received a new message.'
  )
}

const stripHTML = (value: string) =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const shouldUseFallbackFormEmailHTML = (html?: string) => {
  if (!html) return true

  const normalized = stripHTML(html).toLowerCase()

  return normalized === '' || normalized === 'undefined'
}

const sortCollectionsPlugin: Plugin = (incomingConfig) => {
  const sortedCollections = [...(incomingConfig.collections || [])].sort((a, b) => {
    const aIndex = collectionOrderIndex.get(a.slug)
    const bIndex = collectionOrderIndex.get(b.slug)

    if (aIndex === undefined && bIndex === undefined) return 0
    if (aIndex === undefined) return 1
    if (bIndex === undefined) return -1

    return aIndex - bIndex
  })

  return {
    ...incomingConfig,
    collections: sortedCollections,
  }
}

const localizeAdminFields = (fields: Field[] = []): Field[] =>
  fields.map((field) => {
    const localizedField: any = { ...field }

    if ('name' in localizedField && typeof localizedField.name === 'string') {
      const translatedLabel = adminFieldLabels[localizedField.name]

      if (translatedLabel) {
        localizedField.label = translatedLabel
      }

      if (
        localizedField.name === 'value' &&
        localizedField.admin &&
        'description' in localizedField.admin
      ) {
        localizedField.admin = {
          ...localizedField.admin,
          description: 'Може да се генерира автоматично от етикета или да се попълва ръчно.',
        }
      }

      if (localizedField.name === 'title' && localizedField.admin) {
        localizedField.admin = {
          ...localizedField.admin,
          description:
            'Използва се за вътрешна административна ориентация и по подразбиране се попълва автоматично.',
        }
      }

      if (
        Array.isArray(localizedField.options) &&
        selectOptionLabels[localizedField.name] &&
        localizedField.options.every((option: any) => typeof option === 'object' && option !== null)
      ) {
        localizedField.options = localizedField.options.map((option: any) => ({
          ...option,
          label: selectOptionLabels[localizedField.name]?.[option.value] ?? option.label,
        }))
      }

      if (localizedField.name === 'items') {
        localizedField.labels = {
          plural: 'Артикули',
          singular: 'Артикул',
        }
      }
    }

    if ('fields' in localizedField && Array.isArray(localizedField.fields)) {
      localizedField.fields = localizeAdminFields(localizedField.fields)
    }

    if ('tabs' in localizedField && Array.isArray(localizedField.tabs)) {
      localizedField.tabs = localizedField.tabs.map((tab: any) => ({
        ...tab,
        fields: Array.isArray(tab.fields) ? localizeAdminFields(tab.fields) : tab.fields,
      }))
    }

    return localizedField as Field
  })

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | MYWOWDI` : 'MYWOWDI'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    beforeEmail: (emails, { data, req }) => {
      const submissionData = Array.isArray(data?.submissionData) ? data.submissionData : []
      const locale = normalizeLocale(req?.locale)

      return emails.map((email) => {
        const fallbackHTML = buildSubmissionTableHTML(submissionData)
        const contentHTML = shouldUseFallbackFormEmailHTML(email.html) ? fallbackHTML : email.html

        return {
          ...email,
          html: buildFormSubmissionEmail({
            bodyHTML: contentHTML,
            locale,
          }),
          subject: isDefaultEnglishFormSubject(email.subject)
            ? getFormSubmissionSubject(locale)
            : email.subject,
        }
      })
    },
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Съдържание',
      },
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      labels: {
        plural: 'Изпратени форми',
        singular: 'Изпратена форма',
      },
    },
    formOverrides: {
      admin: {
        group: 'Съдържание',
      },
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      labels: {
        plural: 'Форми',
        singular: 'Форма',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    currencies: {
      defaultCurrency: 'EUR',
      supportedCurrencies: [EUR],
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          group: 'Търговия',
          description: 'Поръчките се създават след успешно завършване на checkout процеса.',
        },
        fields: [
          ...localizeAdminFields(defaultCollection.fields).map((field, index) => {
            if (index === 0 && 'tabs' in field && Array.isArray(field.tabs)) {
              return {
                ...field,
                tabs: field.tabs.map((tab, tabIndex) => ({
                  ...tab,
                  label: tabIndex === 0 ? 'Детайли за поръчката' : 'Доставка',
                })),
              }
            }

            return field
          }),
          {
            name: 'accessToken',
            type: 'text',
            label: 'Токен за достъп',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
        ],
        labels: {
          plural: 'Поръчки',
          singular: 'Поръчка',
        },
      }),
    },
    transactions: {
      transactionsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          group: 'Търговия',
          description: 'Транзакциите пазят данните за плащанията и връзката им с поръчките.',
        },
        fields: localizeAdminFields(defaultCollection.fields).map((field, index) => {
          if (index === 0 && 'tabs' in field && Array.isArray(field.tabs)) {
            return {
              ...field,
              tabs: field.tabs.map((tab, tabIndex) => ({
                ...tab,
                label: tabIndex === 0 ? 'Детайли за транзакцията' : 'Фактуриране',
              })),
            }
          }

          return field
        }),
        labels: {
          plural: 'Транзакции',
          singular: 'Транзакция',
        },
      }),
    },
    addresses: {
      addressesCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          group: 'Търговия',
          description:
            'Адресите са свързани с клиентите и се използват за попълване на данните при поръчка.',
        },
        fields: localizeAdminFields(defaultCollection.fields),
        labels: {
          plural: 'Адреси',
          singular: 'Адрес',
        },
      }),
    },
    carts: {
      cartsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          group: 'Търговия',
          description: 'Количките пазят избраните продукти преди създаване на поръчка.',
        },
        fields: localizeAdminFields(defaultCollection.fields),
        labels: {
          plural: 'Колички',
          singular: 'Количка',
        },
      }),
    },
    payments: {
      paymentMethods: stripeEnabled
        ? [
            stripeAdapter({
              publishableKey: stripeKeys.publishableKey!,
              secretKey: stripeKeys.secretKey!,
              webhookSecret: stripeKeys.webhookSecret!,
            }),
          ]
        : [],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      variants: {
        variantOptionsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            group: 'Търговия',
            useAsTitle: 'label',
          },
          fields: [
            ...((localizeAdminFields(defaultCollection.fields) as Field[]).map((field) => {
              const typedField = field as Field & {
                admin?: Record<string, unknown>
                name?: string
              }

              if (typedField.name === 'variantType') {
                return {
                  ...typedField,
                  admin: {
                    ...(typedField.admin ?? {}),
                    description: 'Избери към кой тип вариант принадлежи тази опция.',
                    readOnly: false,
                  },
                } as Field
              }

              return field
            }) as Field[]),
            {
              name: 'shortDescription',
              type: 'text',
              localized: true,
              label: 'Кратко описание',
              admin: {
                description: 'Кратък пояснителен текст под името на варианта.',
              },
            },
            {
              name: 'swatchColor',
              type: 'text',
              label: 'Цвят на индикатора',
              admin: {
                description: 'Hex код, например #6A4937 или #68745B.',
                placeholder: '#6A4937',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return true

                return /^#([0-9A-Fa-f]{6})$/.test(value)
                  ? true
                  : 'Въведи валиден hex код във формат #RRGGBB.'
              },
            },
          ],
          labels: {
            plural: 'Опции на варианти',
            singular: 'Опция на вариант',
          },
        }),
        variantsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            group: 'Търговия',
            description:
              'Вариантите представляват конкретните изпълнения на продукта според избраните опции.',
            useAsTitle: 'title',
          },
          fields: (localizeAdminFields(defaultCollection.fields) as Field[]).map((field) => {
            const typedField = field as Field & {
              admin?: Record<string, unknown>
              name?: string
            }

            if (typedField.name === 'product') {
              return {
                ...typedField,
                admin: {
                  ...(typedField.admin ?? {}),
                  description: 'Първо избери продукта, към който принадлежи този вариант.',
                  readOnly: false,
                },
              } as Field
            }

            if (typedField.name === 'options') {
              const adminConfig = { ...(typedField.admin ?? {}) }

              if ('components' in adminConfig) {
                delete adminConfig.components
              }

              return {
                ...typedField,
                admin: {
                  ...adminConfig,
                  condition: (_data: unknown, siblingData: { product?: string } | undefined) =>
                    Boolean(siblingData?.product),
                  description:
                    'Избери една или повече опции според типовете варианти, активирани в продукта.',
                },
                filterOptions: async ({ req, siblingData }: any) => {
                  const productID = siblingData?.product

                  if (!productID) {
                    return {
                      id: {
                        in: [],
                      },
                    }
                  }

                  const product = await req.payload.findByID({
                    id: productID,
                    collection: 'products',
                    depth: 0,
                    select: {
                      variantTypes: true,
                    },
                  })

                  const variantTypeIDs =
                    product.variantTypes
                      ?.map((item: string | { id?: string | null } | null) => {
                        if (typeof item === 'string') return item
                        if (item && typeof item === 'object' && 'id' in item) {
                          return item.id ?? null
                        }

                        return null
                      })
                      .filter((item: string | null): item is string => Boolean(item)) ?? []

                  if (variantTypeIDs.length === 0) {
                    return {
                      id: {
                        in: [],
                      },
                    }
                  }

                  return {
                    variantType: {
                      in: variantTypeIDs,
                    },
                  }
                },
              } as unknown as Field
            }

            return field
          }),
          labels: {
            plural: 'Варианти',
            singular: 'Вариант',
          },
        }),
        variantTypesCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            group: 'Търговия',
            useAsTitle: 'label',
          },
          fields: localizeAdminFields(defaultCollection.fields),
          labels: {
            plural: 'Типове варианти',
            singular: 'Тип вариант',
          },
        }),
      },
    },
  }),
  sortCollectionsPlugin,
]
