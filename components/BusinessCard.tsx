'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { formatRating } from '@/lib/utils'

interface BusinessCardProps {
  business: {
    id: string
    name: string
    description?: string | null
    address: string
    city: {
      name: string
      nameEt: string
      nameRu: string
    }
    category: {
      nameEt: string
      nameRu: string
    }
    rating: number
    reviewCount: number
    verified?: boolean
  }
  locale: string
}

export function BusinessCard({ business, locale }: BusinessCardProps) {
  const t = useTranslations('common')
  const params = useParams()
  const currentLocale = (params?.locale as string) || locale
  const cityName = currentLocale === 'ru' ? business.city.nameRu : business.city.nameEt
  const categoryName = currentLocale === 'ru' ? business.category.nameRu : business.category.nameEt

  return (
    <div className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-gray-900">{business.name}</h3>
            {business.verified && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">{categoryName}</p>
        </div>
      </div>

      <div className="flex items-center text-gray-600 text-sm mb-3">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{cityName}, {business.address}</span>
      </div>

      {business.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {business.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-accent fill-accent" />
            <span className="ml-1 font-semibold text-gray-900">
              {formatRating(business.rating)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({business.reviewCount} {t('reviews')})
          </span>
        </div>

        <Link
          href={`/businesses/${business.id}`}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors text-sm font-medium"
        >
          {t('details')}
        </Link>
      </div>
    </div>
  )
}


