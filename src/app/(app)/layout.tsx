import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { AdminBar } from '@/components/AdminBar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { GeistMono } from 'geist/font/mono'
import { Manrope, Prata } from 'next/font/google'
import React from 'react'
import './globals.css'

const manrope = Manrope({
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
})

const prata = Prata({
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-prata',
  weight: '400',
})

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const defaultTitle = 'MYWOWDI'
const defaultDescription =
  'Quiet tactile objects in natural materials, created in Europe for focus, rhythm, and calm everyday presence.'
const defaultOgImage = '/coming-soon/hero-background.png'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`,
  },
  description: defaultDescription,
  openGraph: {
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
      },
    ],
    siteName: defaultTitle,
    title: defaultTitle,
    type: 'website',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    description: defaultDescription,
    images: [defaultOgImage],
    title: defaultTitle,
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[manrope.variable, prata.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />
          {children}
        </Providers>
      </body>
    </html>
  )
}
