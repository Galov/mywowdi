import Image from 'next/image'

import { contentLocales, defaultLocale, type ContentLocale } from '@/i18n/config'
import { LogoIcon } from '@/components/icons/logo'

const content: Record<
  ContentLocale,
  {
    eyebrow: string
    title: string
    body: string
    closing: string
  }
> = {
  bg: {
    eyebrow: 'MYWOWDI',
    title: 'Тих ритуал за ръцете. Скоро онлайн.',
    body: 'Подготвяме премиерата на MYWOWDI - малки серии, естествени материали и характерни варианти, създадени да носят фокус, ритъм и спокойно присъствие в деня.',
    closing: 'Първите селектирани варианти ще се появят тук съвсем скоро.',
  },
  de: {
    eyebrow: 'MYWOWDI',
    title: 'Ein leises Ritual für die Hände. Bald online.',
    body: 'Wir bereiten den Start von MYWOWDI vor: kleine Serien, natürliche Materialien und markante Varianten, die Fokus, Rhythmus und eine ruhige Präsenz in den Alltag bringen.',
    closing: 'Die erste kuratierte Auswahl wird hier in Kürze erscheinen.',
  },
  en: {
    eyebrow: 'MYWOWDI',
    title: 'A quiet ritual for restless hands. Launching soon.',
    body: 'We are preparing the debut of MYWOWDI - small-batch pieces in natural materials, shaped to bring focus, rhythm, and calm presence into everyday moments.',
    closing: 'The first curated pieces will arrive here very soon.',
  },
  es: {
    eyebrow: 'MYWOWDI',
    title: 'Un ritual sereno para manos inquietas. Muy pronto online.',
    body: 'Estamos preparando el estreno de MYWOWDI: pequeñas series, materiales naturales y variantes con carácter pensadas para aportar enfoque, ritmo y calma al día a día.',
    closing: 'La primera selección curada aparecerá aquí muy pronto.',
  },
  fr: {
    eyebrow: 'MYWOWDI',
    title: 'Un rituel discret pour les mains agitées. Bientôt en ligne.',
    body: 'Nous préparons le lancement de MYWOWDI : de petites séries, des matières naturelles et des variantes affirmées pensées pour apporter rythme, concentration et calme au quotidien.',
    closing: 'La première sélection arrivera ici très bientôt.',
  },
  it: {
    eyebrow: 'MYWOWDI',
    title: 'Un rituale quieto per mani irrequiete. Presto online.',
    body: 'Stiamo preparando il debutto di MYWOWDI - piccole serie, materiali naturali e varianti dal carattere deciso, pensate per portare concentrazione, ritmo e calma nei gesti quotidiani.',
    closing: 'La prima selezione arriverà qui a breve.',
  },
}

const resolveLocale = (value?: string): ContentLocale => {
  const locale = contentLocales.find(({ code }) => code === value)?.code

  return locale ?? defaultLocale
}

export const ComingSoon = ({ locale: rawLocale }: { locale?: string }) => {
  const locale = resolveLocale(rawLocale)
  const copy = content[locale]

  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--theme-elevation-950)]">
      <Image
        alt="Preview of the MYWOWDI collection"
        className="object-cover object-center"
        fill
        priority
        src="/coming-soon/hero-background.png"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,19,13,0.74)_0%,rgba(28,19,13,0.58)_34%,rgba(28,19,13,0.18)_68%,rgba(28,19,13,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,247,236,0.18),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,7,0.18)_0%,rgba(20,12,7,0.38)_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 sm:px-10 lg:px-14">
        <section className="w-full max-w-2xl rounded-[2.5rem] border border-[rgba(255,247,236,0.18)] bg-[rgba(246,236,222,0.14)] p-8 text-[#fbf6ec] shadow-[0_32px_120px_rgba(23,14,10,0.38)] backdrop-blur-[18px] md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <LogoIcon alt="MYWOWDI logo" className="w-14 rounded-full ring-1 ring-[rgba(255,247,236,0.18)]" priority />
            <p className="text-xs uppercase tracking-[0.45em] text-[rgba(251,246,236,0.68)]">
              {copy.eyebrow}
            </p>
          </div>

          <h1 className="max-w-3xl font-[family-name:var(--font-prata)] text-4xl leading-[0.96] tracking-[-0.05em] text-[#fff8ef] sm:text-5xl md:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[rgba(251,246,236,0.82)] sm:text-lg">
            {copy.body}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(251,246,236,0.82)] sm:text-lg">
            {copy.closing}
          </p>
        </section>
      </div>
    </main>
  )
}
