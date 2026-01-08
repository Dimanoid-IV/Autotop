import { prisma } from '@/lib/prisma'
import { BusinessCard } from './BusinessCard'

interface FeaturedBusinessesProps {
  locale: string
}

export async function FeaturedBusinesses({ locale }: FeaturedBusinessesProps) {
  // Получаем 6 случайных оплаченных бизнесов
  const businesses = await prisma.business.findMany({
    where: {
      isFeatured: true,
      featuredUntil: {
        gte: new Date()
      }
    },
    include: {
      city: true,
      category: true,
      reviews: {
        where: { status: 'APPROVED' },
        select: {
          rating: true
        }
      }
    },
    take: 6,
    orderBy: {
      featuredOrder: 'asc'
    }
  })

  if (businesses.length === 0) return null

  // Преобразуем данные для BusinessCard
  const featuredBusinesses = businesses.map(business => {
    const reviewCount = business.reviews.length
    const rating = reviewCount > 0
      ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0

    return {
      id: business.id,
      name: business.name,
      description: business.description,
      address: business.address,
      latitude: business.latitude,
      longitude: business.longitude,
      city: business.city,
      category: business.category,
      rating,
      reviewCount,
      verified: business.verified
    }
  })

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header с меткой "Реклама" */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {locale === 'ru' ? 'Рекомендуемые автосервисы' : 'Soovitatud autoteenused'}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {locale === 'ru' ? 'Реклама' : 'Reklaam'}
        </span>
      </div>

      {/* Выделенная рамка */}
      <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBusinesses.map((business) => (
            <div key={business.id} className="relative">
              {/* Premium Badge */}
              <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                TOP
              </div>
              <BusinessCard business={business} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Дисклеймер */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        {locale === 'ru' 
          ? 'Компании отмечены как "TOP" оплатили размещение в этом блоке. Порядок показа произвольный.'
          : 'Ettevõtted märgitud "TOP" maksis paigutuse selles plokis. Järjekord on juhuslik.'}
      </p>
    </section>
  )
}
