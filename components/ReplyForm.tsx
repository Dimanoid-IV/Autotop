'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const replySchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
})

interface ReplyFormProps {
  reviewId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ReplyForm({ reviewId, onSuccess, onCancel }: ReplyFormProps) {
  const t = useTranslations('review')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(replySchema),
  })

  const onSubmit = async (data: any) => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          reviewId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit reply')
      }

      reset()
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <textarea
          {...register('comment')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={t('replyPlaceholder')}
        />
        {errors.comment && (
          <p className="text-sm text-red-600 mt-1">
            {errors.comment.message as string}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
        >
          {submitting ? t('loading') : t('submit')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
        >
          {t('cancel')}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        {t('pending')} - Your reply will be published after moderation.
      </p>
    </form>
  )
}


