import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Горна навигация',
  admin: {
    group: 'Съдържание',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGlobal('header')],
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Навигационни елементи',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
