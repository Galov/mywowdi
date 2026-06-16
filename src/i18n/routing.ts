import { contentLocaleCodes, defaultLocale, isSupportedContentLocale, type ContentLocale } from './config'

const NON_LOCALIZED_PREFIXES = ['/admin', '/api', '/next']
const EXTERNAL_PROTOCOLS = ['http://', 'https://', 'mailto:', 'tel:']

const splitHref = (href: string) => {
  const [pathAndQuery, hash = ''] = href.split('#')
  const [pathname, search = ''] = pathAndQuery.split('?')

  return {
    hash,
    pathname,
    search,
  }
}

export const normalizeLocale = (value?: null | string): ContentLocale => {
  if (value && isSupportedContentLocale(value)) {
    return value
  }

  return defaultLocale
}

export const hasLocalePrefix = (pathname: string) => {
  const { pathname: cleanPathname } = splitHref(pathname)
  const [, firstSegment] = cleanPathname.split('/')

  return Boolean(firstSegment && contentLocaleCodes.includes(firstSegment as ContentLocale))
}

export const stripLocaleFromPathname = (pathname: string) => {
  const { pathname: cleanPathname, search, hash } = splitHref(pathname)

  if (!hasLocalePrefix(cleanPathname)) {
    return pathname
  }

  const segments = cleanPathname.split('/').filter(Boolean)
  const [, ...rest] = segments
  const normalizedPath = rest.length ? `/${rest.join('/')}` : '/'
  const normalizedSearch = search ? `?${search}` : ''
  const normalizedHash = hash ? `#${hash}` : ''

  return `${normalizedPath}${normalizedSearch}${normalizedHash}`
}

export function getLocalizedHref(locale: ContentLocale, href: string): string
export function getLocalizedHref(locale: ContentLocale, href?: null | string): string | null | undefined
export function getLocalizedHref(locale: ContentLocale, href?: null | string) {
  if (!href) {
    return href
  }

  if (EXTERNAL_PROTOCOLS.some((protocol) => href.startsWith(protocol)) || href.startsWith('//')) {
    return href
  }

  if (href.startsWith('#') || !href.startsWith('/')) {
    return href
  }

  if (NON_LOCALIZED_PREFIXES.some((prefix) => href.startsWith(prefix)) || hasLocalePrefix(href)) {
    return href
  }

  const { pathname, search, hash } = splitHref(href)
  const localizedPathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  const localizedSearch = search ? `?${search}` : ''
  const localizedHash = hash ? `#${hash}` : ''

  return `${localizedPathname}${localizedSearch}${localizedHash}`
}

export const resolveLocale = async (
  params?: Promise<{ locale?: string }> | { locale?: string },
): Promise<ContentLocale> => {
  if (!params) {
    return defaultLocale
  }

  const resolvedParams = await params

  return normalizeLocale(resolvedParams?.locale)
}
