import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    plural: 'Настройки на сайта',
    singular: 'Настройки на сайта',
  },
  admin: {
    group: 'Съдържание',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'comingSoonEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Режим „Скоро онлайн“',
    },
  ],
}
