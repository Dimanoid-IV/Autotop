import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedBusinesses } from '@/components/FeaturedBusinesses'
import { BusinessSearchGrid } from '@/components/BusinessSearchGrid'
import { TopBusinesses } from '@/components/TopBusinesses'
import { LatestReviews } from '@/components/LatestReviews'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations()

  return (
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
  )
}





