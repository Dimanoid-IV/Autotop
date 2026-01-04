'use client'

import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { StarRating } from './StarRating'
import { getInitials } from '@/lib/utils'
import { ReplyForm } from './ReplyForm'
import { useState } from 'react'

interface ReviewListProps {
  reviews: any[]
  locale: string
}

export function ReviewList({ reviews, locale }: ReviewListProps) {
  const t = useTranslations('review')
  const { data: session } = useSession()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-200 pb-6 last:border-b-0"
        >
          <div className="flex items-start gap-4 mb-3">
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
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
                <StarRating rating={review.rating} readonly />
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          </div>

          {/* Replies */}
          {review.replies && review.replies.length > 0 && (
            <div className="ml-16 mt-4 pl-4 border-l-2 border-primary">
              {review.replies.map((reply: any) => (
                <div key={reply.id} className="mb-3">
                  <div className="flex items-start gap-3">
                    {reply.user.image ? (
                      <img
                        src={reply.user.image}
                        alt={reply.user.name || 'Owner'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
                        {getInitials(reply.user.name || reply.user.email || 'O')}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {reply.user.name || 'Business Owner'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {reply.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reply.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Button (for business owners) */}
          {session && !replyingTo && (
            <div className="ml-16 mt-3">
              <button
                onClick={() => setReplyingTo(review.id)}
                className="text-sm text-primary hover:underline"
              >
                {t('reply')}
              </button>
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === review.id && (
            <div className="ml-16 mt-4">
              <ReplyForm
                reviewId={review.id}
                onSuccess={() => {
                  setReplyingTo(null)
                  window.location.reload()
                }}
                onCancel={() => setReplyingTo(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

