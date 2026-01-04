'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { StarRating } from './StarRating'
import { getInitials } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

interface LatestReviewsProps {
  locale: string
}

export function LatestReviews({ locale }: LatestReviewsProps) {
  const t = useTranslations('latestReviews')
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/latest-reviews?limit=3')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch latest reviews')
        }
        return res.json()
      })
      .then((data) => {
        // Ensure data is an array
        const reviewsList = Array.isArray(data) ? data : []
        setReviews(reviewsList)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading latest reviews:', error)
        setReviews([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return null
  }

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-card shadow-card p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              {review.user.image ? (
                <img
                  src={review.user.image}
                  alt={review.user.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {getInitials(review.user.name || review.user.email || 'U')}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {review.user.name || 'Anonymous'}
                </p>
                <StarRating rating={review.rating} readonly size="sm" />
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {review.comment}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{review.business.name}</span>
              <Link
                href={`/businesses/${review.business.id}`}
                className="text-primary hover:underline"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

