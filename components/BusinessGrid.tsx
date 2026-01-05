'use client'

import { useState, useEffect } from 'react'
import { BusinessCard } from './BusinessCard'
import { useTranslations } from 'next-intl'

interface BusinessGridProps {
  locale: string
}

export function BusinessGrid({ locale }: BusinessGridProps) {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadBusinesses()
  }, [page])

  const loadBusinesses = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/businesses?page=${page}&limit=12`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Failed to fetch businesses: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Businesses data received:', data)
      
      const businessesList = data?.businesses || []
      const pagination = data?.pagination || { page: 1, totalPages: 1 }
      
      console.log('Businesses list:', businessesList.length, 'items')
      
      if (page === 1) {
        setBusinesses(businessesList)
      } else {
        setBusinesses((prev) => [...(prev || []), ...businessesList])
      }
      setHasMore(pagination.page < pagination.totalPages)
    } catch (error) {
      console.error('Error loading businesses:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && (!businesses || businesses.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No businesses found</p>
      </div>
    )
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} locale={locale} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </section>
  )
}

