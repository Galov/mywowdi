import { ComingSoon } from '@/components/ComingSoon'

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const { locale } = await searchParams

  return <ComingSoon locale={locale} />
}
