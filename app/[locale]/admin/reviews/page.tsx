'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { StarRating } from '@/components/StarRating'
import { getInitials } from '@/lib/utils'

export default function AdminReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user || user.role !== 'ADMIN') {
      router.push('/')
      return
    }

    loadPendingReviews()
  }, [user, authLoading, router])

  const loadPendingReviews = async () => {
    try {
      const response = await fetch('/api/reviews?status=PENDING')
      if (response.ok) {
        const data = await response.json()
        setReviews(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reject`, {
        method: 'POST',
      })
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
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
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
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




