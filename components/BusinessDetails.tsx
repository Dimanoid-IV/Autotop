'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import { MapPin, Phone, Globe, CheckCircle, Star } from 'lucide-react'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'
import { OwnerVerificationCTA } from './OwnerVerificationCTA'
import { formatRating } from '@/lib/utils'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./Map').then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
})

interface BusinessDetailsProps {
  business: any
  locale: string
}

export function BusinessDetails({ business, locale }: BusinessDetailsProps) {
  const t = useTranslations('business')
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  // Совместимость: создаем объект session для компонентов, которые его ожидают
  const session = user ? { user } : null

  const cityName = locale === 'ru' ? business.city.nameRu : business.city.nameEt
  const categoryName = locale === 'ru' ? business.category.nameRu : business.category.nameEt

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-card shadow-card p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {business.name}
                  </h1>
                  {business.verified && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-4">{categoryName}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent fill-accent" />
                    <span className="text-xl font-semibold">
                      {formatRating(business.rating)}
                    </span>
                    <span className="text-gray-500">
                      ({business.reviewCount} {t('reviews')})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5" />
                <span>
                  {cityName}, {business.address}
                </span>
              </div>
              {business.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-5 w-5" />
                  <a href={`tel:${business.phone}`} className="hover:text-primary">
                    {business.phone}
                  </a>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="h-5 w-5" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    {business.website}
                  </a>
                </div>
              )}
            </div>

            {business.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('description')}</h2>
                <p className="text-gray-700">{business.description}</p>
              </div>
            )}

            {/* Map - показываем всегда если есть адрес или координаты */}
            {(business.latitude && business.longitude) || business.address ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {locale === 'ru' ? 'Карта' : 'Kaart'}
                </h2>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  {business.latitude && business.longitude ? (
                    // Leaflet карта с координатами
                    <DynamicMap
                      latitude={business.latitude}
                      longitude={business.longitude}
                      name={business.name}
                    />
                  ) : (
                    // Google Maps Embed по адресу
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${business.city.nameRu || business.city.nameEt}, ${business.address}, Estonia`
                      )}&output=embed`}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            ) : null}

            <OwnerVerificationCTA
              business={business}
              session={session}
              locale={locale}
            />
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-card shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('reviews')} ({business.reviewCount})
              </h2>
              {session && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors"
                >
                  {showReviewForm ? t('cancel') : t('writeReview')}
                </button>
              )}
            </div>

            {showReviewForm && session && (
              <div className="mb-6">
                <ReviewForm
                  businessId={business.id}
                  onSuccess={() => {
                    setShowReviewForm(false)
                    window.location.reload()
                  }}
                />
              </div>
            )}

            {!session && (
              <p className="text-gray-600 mb-6">
                Please sign in to leave a review.
              </p>
            )}

            <ReviewList reviews={business.reviews} locale={locale} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={business.rating} readonly />
                  <span className="font-semibold">
                    {formatRating(business.rating)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="font-semibold">{business.reviewCount}</p>
              </div>
              {business.verified && (
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-primary">
                    {t('verified')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



