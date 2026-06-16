import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    plural: 'Site Settings',
    singular: 'Site Settings',
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
      label: 'Coming soon режим',
    },
  ],
}
