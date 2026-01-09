'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { StarRating } from './StarRating'

interface ReviewFormProps {
  businessId: string
  onSuccess: () => void
}

export function ReviewForm({ businessId, onSuccess }: ReviewFormProps) {
  const t = useTranslations('review')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError(t('pleaseSelectRating'))
      return
    }
    
    if (!comment.trim()) {
      setError(t('commentRequired'))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          businessId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('failedToSubmitReview'))
      }

      setRating(0)
      setComment('')
      onSuccess()
    } catch (err: any) {
      setError(err.message || t('anErrorOccurred'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form 
      onSubmit={handleFormSubmit}
      className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('rating')} *
        </label>
        <StarRating rating={rating} onChange={setRating} />
        {rating === 0 && (
          <p className="text-sm text-red-600 mt-1">{t('pleaseSelectRating')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('comment')} *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={t('comment')}
        />
        {!comment.trim() && (
          <p className="text-sm text-red-600 mt-1">{t('commentRequired')}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting || rating === 0 || !comment.trim()}
          className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t('loading') : t('submit')}
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {t('pending')} - Your review will be published after moderation.
      </p>
    </form>
  )
}


