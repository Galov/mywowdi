import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    plural: 'Категории',
    singular: 'Категория',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Съдържание',
  },
  fields: [
    {
      name: 'title',
      localized: true,
      type: 'text',
      label: 'Заглавие',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
