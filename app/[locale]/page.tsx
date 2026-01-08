import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedBusinesses } from '@/components/FeaturedBusinesses'
import { BusinessSearchGrid } from '@/components/BusinessSearchGrid'
import { TopBusinesses } from '@/components/TopBusinesses'
import { LatestReviews } from '@/components/LatestReviews'
import { generateWebsiteSchema } from '@/lib/jsonLd'
import { getBaseUrl } from '@/lib/url'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = getBaseUrl()
  
  const isRu = locale === 'ru'
  
  return {
    title: isRu 
      ? 'AutoTop - Рейтинги автосервисов в Эстонии'
      : 'AutoTop - Autoteenuste hinnangud Eestis',
    description: isRu
      ? 'Найдите лучшие автосервисы в Эстонии. Отзывы, рейтинги и контакты. Tallinn, Tartu, Narva, Pärnu и другие города.'
      : 'Leia parimad autoteenused Eestis. Arvustused, hinnangud ja kontaktid. Tallinn, Tartu, Narva, Pärnu ja teised linnad.',
    keywords: isRu
      ? 'автосервис эстония, ремонт авто, автосервис таллинн, автосервис тарту, отзывы автосервисов, автосервис нарва, автосервис парну'
      : 'autoteenused eesti, autoremont, autoteenused tallinn, autoteenused tartu, arvustused, autoteenused narva, autoteenused pärnu',
    openGraph: {
      title: isRu 
        ? 'AutoTop - Рейтинги автосервисов в Эстонии'
        : 'AutoTop - Autoteenuste hinnangud Eestis',
      description: isRu
        ? 'Найдите лучшие автосервисы в Эстонии'
        : 'Leia parimad autoteenused Eestis',
      url: `${baseUrl}/${locale}`,
      siteName: 'AutoTop',
      locale: locale,
      type: 'website',
      images: [{
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'AutoTop',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isRu 
        ? 'AutoTop - Рейтинги автосервисов в Эстонии'
        : 'AutoTop - Autoteenuste hinnangud Eestis',
      description: isRu
        ? 'Найдите лучшие автосервисы в Эстонии'
        : 'Leia parimad autoteenused Eestis',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'et': `${baseUrl}/et`,
        'ru': `${baseUrl}/ru`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations()
  const websiteSchema = generateWebsiteSchema(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <LanguageSwitcher />
        
        <main className="flex-1">
          <HeroSection locale={locale} />
          <div className="container mx-auto px-4 py-8">
            <FeaturedBusinesses locale={locale} />
            <BusinessSearchGrid locale={locale} />
            <TopBusinesses locale={locale} />
            <LatestReviews locale={locale} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}





