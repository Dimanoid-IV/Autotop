'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { StarRating } from '@/components/StarRating'
import { getInitials } from '@/lib/utils'

export default function AdminReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    loadPendingReviews()
  }, [session, status, router])

  const loadPendingReviews = async () => {
    try {
      // In a real app, you'd have an API endpoint for this
      // For now, we'll fetch all reviews and filter client-side
      const response = await fetch('/api/reviews')
      const data = await response.json()
      setReviews(data.filter((r: any) => r.status === 'PENDING'))
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LanguageSwitcher />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No pending reviews</p>
        ) : (
          <div className="space-y-6">
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
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`/api/reviews/${review.id}/approve`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </a>
                  <a
                    href={`/api/reviews/${review.id}/reject`}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

