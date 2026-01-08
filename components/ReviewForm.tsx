'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { StarRating } from './StarRating'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
})

interface ReviewFormProps {
  businessId: string
  onSuccess: () => void
}

export function ReviewForm({ businessId, onSuccess }: ReviewFormProps) {
  const t = useTranslations('review')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
  })

  const onSubmit = async (data: any) => {
    console.log('🚀 onSubmit called', { data, rating, businessId })
    
    if (rating === 0) {
      console.error('❌ Rating is 0')
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      console.log('📤 Sending review...')
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          rating,
          businessId,
        }),
      })

      console.log('📥 Response received', { status: response.status, ok: response.ok })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Error response:', errorData)
        throw new Error(errorData.error || 'Failed to submit review')
      }

      console.log('✅ Review submitted successfully')
      reset()
      setRating(0)
      onSuccess()
    } catch (err: any) {
      console.error('❌ Submission error:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit((data) => {
      console.log('📝 Form handleSubmit called', { data, rating, errors })
      onSubmit(data)
    })} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('rating')} *
        </label>
        <StarRating rating={rating} onChange={setRating} />
        {rating === 0 && (
          <p className="text-sm text-red-600 mt-1">Please select a rating</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('comment')} *
        </label>
        <textarea
          {...register('comment', { required: 'Comment is required' })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={t('comment')}
        />
        {errors.comment && (
          <p className="text-sm text-red-600 mt-1">
            {errors.comment.message as string}
          </p>
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
          disabled={submitting || rating === 0}
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


