import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { BusinessDetails } from '@/components/BusinessDetails'
import { generateBusinessSchema, generateBreadcrumbSchema } from '@/lib/jsonLd'
import { getBaseUrl } from '@/lib/url'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const { id, locale } = await params
  const baseUrl = getBaseUrl()
  
  try {
    // Получаем данные бизнеса
    const businessResponse = await fetch(
      `${baseUrl}/api/businesses/${id}`,
      { cache: 'no-store' }
    )
    
    if (!businessResponse.ok) {
      return {
        title: 'Business not found',
      }
    }
    
    const business = await businessResponse.json()
    const isRu = locale === 'ru'
    const cityName = isRu ? business.city?.nameRu : business.city?.nameEt
    const categoryName = isRu ? business.category?.nameRu : business.category?.nameEt
    
    // Вычисляем средний рейтинг
    const approvedReviews = business.reviews?.filter((r: any) => r.status === 'APPROVED') || []
    const avgRating = approvedReviews.length > 0
      ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length
      : 0
    
    const title = isRu
      ? `${business.name} - ${categoryName} в ${cityName} | AutoTop`
      : `${business.name} - ${categoryName} ${cityName} | AutoTop`
    
    const description = isRu
      ? `${business.name}: ${categoryName} в ${cityName}. Рейтинг ${avgRating.toFixed(1)}/5 ⭐. ${approvedReviews.length} отзывов.${business.address ? ` Адрес: ${business.address}.` : ''}${business.phone ? ` Телефон: ${business.phone}.` : ''}`
      : `${business.name}: ${categoryName} ${cityName}. Hinnang ${avgRating.toFixed(1)}/5 ⭐. ${approvedReviews.length} arvustust.${business.address ? ` Aadress: ${business.address}.` : ''}${business.phone ? ` Telefon: ${business.phone}.` : ''}`
    
    return {
      title: title.substring(0, 60), // Max 60 chars
      description: description.substring(0, 160), // Max 160 chars
      openGraph: {
        title: title.substring(0, 60),
        description: description.substring(0, 160),
        url: `${baseUrl}/${locale}/businesses/${id}`,
        type: 'website',
        siteName: 'AutoTop',
        locale: locale,
        images: [{
          url: `${baseUrl}/og-business.jpg`,
          width: 1200,
          height: 630,
          alt: business.name,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: title.substring(0, 60),
        description: description.substring(0, 160),
      },
      alternates: {
        canonical: `${baseUrl}/${locale}/businesses/${id}`,
        languages: {
          'et': `${baseUrl}/et/businesses/${id}`,
          'ru': `${baseUrl}/ru/businesses/${id}`,
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
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Business',
    }
  }
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params

  try {
    const baseUrl = getBaseUrl()
    
    const response = await fetch(
      `${baseUrl}/api/businesses/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`Business not found: ${id}, status: ${response.status}`)
      notFound()
    }

    const business = await response.json()
    
    if (!business || !business.id) {
      console.error(`Invalid business data for id: ${id}`)
      notFound()
    }

    // Генерируем структурированные данные
    const businessSchema = generateBusinessSchema(business, locale)
    const isRu = locale === 'ru'
    const cityName = isRu ? business.city?.nameRu : business.city?.nameEt
    const categoryName = isRu ? business.category?.nameRu : business.category?.nameEt
    
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: isRu ? 'Главная' : 'Avaleht', url: `${baseUrl}/${locale}` },
      { name: cityName || '', url: `${baseUrl}/${locale}?city=${business.cityId}` },
      { name: categoryName || '', url: `${baseUrl}/${locale}?category=${business.categoryId}` },
      { name: business.name, url: `${baseUrl}/${locale}/businesses/${business.id}` },
    ])

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <LanguageSwitcher />
          <main className="flex-1">
            <BusinessDetails business={business} locale={locale} />
          </main>
          <Footer />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching business:', error)
    notFound()
  }
}


