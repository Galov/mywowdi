import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { bg } from '@payloadcms/translations/languages/bg'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Inquiries } from '@/collections/Inquiries'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { SiteSettings } from '@/globals/SiteSettings'
import { adminLocale, contentLocales, defaultLocale } from '@/i18n/config'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS || 'no-reply@mywowdi.com'
const emailFromName = process.env.EMAIL_FROM_NAME || 'MYWOWDI'
const emailAdapter = process.env.RESEND_API_KEY
  ? await nodemailerAdapter({
      defaultFromAddress: emailFromAddress,
      defaultFromName: emailFromName,
      transportOptions: {
        auth: {
          pass: process.env.RESEND_API_KEY,
          user: 'resend',
        },
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
      },
    })
  : await nodemailerAdapter({
      defaultFromAddress: emailFromAddress,
      defaultFromName: emailFromName,
    })

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Icon: '@/components/admin/AdminIcon#AdminIcon',
        Logo: '@/components/admin/AdminLogo#AdminLogo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
    },
    dateFormat: 'dd MMM yyyy',
    user: Users.slug,
  },
  collections: [Users, Pages, Categories, Media, Inquiries],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: emailAdapter,
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  endpoints: [],
  globals: [Header, Footer, SiteSettings],
  i18n: {
    fallbackLanguage: adminLocale,
    supportedLanguages: {
      bg,
    },
  },
  localization: {
    defaultLocale,
    fallback: true,
    locales: [...contentLocales],
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
