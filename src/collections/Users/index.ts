import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'
import { normalizeLocale } from '@/i18n/routing'
import { buildResetPasswordEmail } from '@/utilities/email/templates'
import { getServerSideURL } from '@/utilities/getURL'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'Потребители',
    singular: 'Потребител',
  },
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Потребители',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const locale = normalizeLocale(args?.req?.locale)
        const token = args?.token || ''
        const resetURL = `${getServerSideURL()}/${locale}/reset-password?token=${token}`

        return buildResetPasswordEmail({
          locale,
          resetURL,
        }).html
      },
      generateEmailSubject: (args) => {
        const locale = normalizeLocale(args?.req?.locale)

        return buildResetPasswordEmail({
          locale,
          resetURL: '#',
        }).subject
      },
    },
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Име',
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Роли',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Администратор',
          value: 'admin',
        },
        {
          label: 'Клиент',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      label: 'Поръчки',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      label: 'Количка',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      label: 'Адреси',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
  ],
}
