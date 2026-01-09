import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Providers } from './providers'
import { getBaseUrl } from '@/lib/url'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = getBaseUrl()
  
  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'et': '/et',
        'ru': '/ru',
        'x-default': '/et',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const baseUrl = getBaseUrl()

  return (
    <html lang={locale}>
      <head>
        <meta name="facebook-domain-verification" content="pqr35d8szz2pyh9atlpz7ftg7wkgv2" />
        <link rel="alternate" hrefLang="et" href={`${baseUrl}/et`} />
        <link rel="alternate" hrefLang="ru" href={`${baseUrl}/ru`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/et`} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>

        {/* Google Analytics - disabled temporarily to fix buttons, will re-enable after testing */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JZ4SB6WLF0"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JZ4SB6WLF0');
          `}
        </Script> */}
      </body>
    </html>
  )
}

