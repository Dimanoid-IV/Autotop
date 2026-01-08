'use client'

import { useState, useEffect, useCallback } from 'react'
import { BusinessCard } from './BusinessCard'
import { SearchBar } from './SearchBar'

interface BusinessSearchGridProps {
  locale: string
}

export function BusinessSearchGrid({ locale }: BusinessSearchGridProps) {
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ city?: string; category?: string }>({})

  // Загрузка городов и категорий
  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then(setCities)
      .catch(console.error)

    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  // Загрузка бизнесов с фильтрами
  const loadBusinesses = useCallback(async (resetPage = false) => {
    setLoading(true)
    try {
      const currentPage = resetPage ? 1 : page
      
      // Строим URL с параметрами
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (filters.city) params.append('city', filters.city)
      if (filters.category) params.append('category', filters.category)

      const response = await fetch(`/api/businesses?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.status}`)
      }
      
      const data = await response.json()
      const businessesList = data?.businesses || []
      const pagination = data?.pagination || { page: 1, totalPages: 1 }
      
      if (resetPage || currentPage === 1) {
        setBusinesses(businessesList)
        setPage(1)
      } else {
        setBusinesses((prev) => [...prev, ...businessesList])
      }
      
      setHasMore(pagination.page < pagination.totalPages)
    } catch (error) {
      console.error('Error loading businesses:', error)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, filters])

  // Перезагрузка при изменении фильтров
  useEffect(() => {
    loadBusinesses(true)
  }, [searchQuery, filters])

  // Загрузка следующей страницы
  useEffect(() => {
    if (page > 1) {
      loadBusinesses(false)
    }
  }, [page])

  const handleLoadMore = () => {
    setPage((p) => p + 1)
  }

  return (
    <section className="mb-12">
      {/* Поиск и фильтры */}
      <div className="mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          cities={cities}
          categories={categories}
          locale={locale}
          sticky={true}
        />
      </div>

      {/* Загрузка */}
      {loading && businesses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {locale === 'ru' ? 'Загрузка...' : 'Laadimine...'}
          </p>
        </div>
      )}

      {/* Нет результатов */}
      {!loading && businesses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {locale === 'ru' ? 'Ничего не найдено' : 'Midagi ei leitud'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {locale === 'ru' 
              ? 'Попробуйте изменить параметры поиска' 
              : 'Proovige muuta otsinguparameetreid'}
          </p>
        </div>
      )}

      {/* Сетка бизнесов */}
      {businesses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} locale={locale} />
            ))}
          </div>

          {/* Кнопка "Загрузить еще" */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading 
                  ? (locale === 'ru' ? 'Загрузка...' : 'Laadimine...') 
                  : (locale === 'ru' ? 'Загрузить еще' : 'Laadi veel')}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
