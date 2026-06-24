import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

const createInquiryReference = () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()

  return `INQ-${timestamp}-${random}`
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    plural: 'Запитвания',
    singular: 'Запитване',
  },
  access: {
    admin: ({ req }) => Boolean(req.user && adminOnly({ req })),
    create: () => false,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['reference', 'status', 'customerName', 'customerEmail', 'createdAt'],
    description:
      'Запитванията се създават от checkout-а, когато клиентът изпрати интерес към продуктите в количката си.',
    group: 'Търговия',
    useAsTitle: 'reference',
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      label: 'Референция',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ operation, value }) => {
            if (operation === 'create' && !value) {
              return createInquiryReference()
            }

            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: 'Ново', value: 'new' },
        { label: 'В процес', value: 'in-progress' },
        { label: 'Приключено', value: 'completed' },
        { label: 'Отказано', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'locale',
      type: 'select',
      label: 'Език',
      defaultValue: 'bg',
      options: [
        { label: 'Български', value: 'bg' },
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Français', value: 'fr' },
        { label: 'Italiano', value: 'it' },
        { label: 'Español', value: 'es' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'Име на клиента',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Имейл на клиента',
      required: true,
      index: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      label: 'Телефон',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Артикули',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Продукт',
          required: true,
        },
        {
          name: 'variant',
          type: 'relationship',
          relationTo: 'variants',
          label: 'Вариант',
        },
        {
          name: 'productTitle',
          type: 'text',
          label: 'Име на продукта',
          required: true,
        },
        {
          name: 'variantLabel',
          type: 'text',
          label: 'Име на варианта',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Количество',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          label: 'Единична цена',
          required: true,
          min: 0,
        },
        {
          name: 'lineTotal',
          type: 'number',
          label: 'Сума за реда',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'totalProductAmount',
      type: 'number',
      label: 'Обща стойност на продуктите',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Валута',
      defaultValue: 'EUR',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      type: 'collapsible',
      label: 'Адрес за фактуриране',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'billingAddress',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', label: 'Обръщение' },
            { name: 'firstName', type: 'text', label: 'Име', required: true },
            { name: 'lastName', type: 'text', label: 'Фамилия', required: true },
            { name: 'company', type: 'text', label: 'Компания' },
            { name: 'phone', type: 'text', label: 'Телефон' },
            { name: 'addressLine1', type: 'text', label: 'Адрес 1', required: true },
            { name: 'addressLine2', type: 'text', label: 'Адрес 2' },
            { name: 'city', type: 'text', label: 'Град', required: true },
            { name: 'state', type: 'text', label: 'Област / регион' },
            { name: 'postalCode', type: 'text', label: 'Пощенски код', required: true },
            { name: 'country', type: 'text', label: 'Държава', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Адрес за доставка',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'shippingAddressSameAsBilling',
          type: 'checkbox',
          label: 'Съвпада с адреса за фактуриране',
          defaultValue: true,
        },
        {
          name: 'shippingAddress',
          type: 'group',
          admin: {
            condition: (_, siblingData) => !siblingData?.shippingAddressSameAsBilling,
          },
          fields: [
            { name: 'title', type: 'text', label: 'Обръщение' },
            { name: 'firstName', type: 'text', label: 'Име' },
            { name: 'lastName', type: 'text', label: 'Фамилия' },
            { name: 'company', type: 'text', label: 'Компания' },
            { name: 'phone', type: 'text', label: 'Телефон' },
            { name: 'addressLine1', type: 'text', label: 'Адрес 1' },
            { name: 'addressLine2', type: 'text', label: 'Адрес 2' },
            { name: 'city', type: 'text', label: 'Град' },
            { name: 'state', type: 'text', label: 'Област / регион' },
            { name: 'postalCode', type: 'text', label: 'Пощенски код' },
            { name: 'country', type: 'text', label: 'Държава' },
          ],
        },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Вътрешни бележки',
    },
  ],
  timestamps: true,
}
