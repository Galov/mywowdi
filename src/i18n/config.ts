export const adminLocale = 'bg' as const

export const defaultLocale = 'en' as const

export const contentLocales = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'es', label: 'Español' },
  { code: 'bg', label: 'Български' },
] as const

export type ContentLocale = (typeof contentLocales)[number]['code']

export const contentLocaleCodes = contentLocales.map(({ code }) => code)

export const isSupportedContentLocale = (value: string): value is ContentLocale =>
  contentLocaleCodes.includes(value as ContentLocale)
