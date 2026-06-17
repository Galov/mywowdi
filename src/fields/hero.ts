import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Тип',
      options: [
        {
          label: 'Без херо секция',
          value: 'none',
        },
        {
          label: 'Силен акцент',
          value: 'highImpact',
        },
        {
          label: 'Среден акцент',
          value: 'mediumImpact',
        },
        {
          label: 'Лек акцент',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      localized: true,
      type: 'richText',
      label: 'Текст',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      label: 'Изображение',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: 'Херо секция',
}
