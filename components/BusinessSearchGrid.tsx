'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [geoDetected, setGeoDetected] = useState(false)
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ city?: string; category?: string }>({})

  // Ref для отслеживания текущего запроса и предотвращения дубликатов
  const loadingRef = useRef(false)
  const lastFiltersRef = useRef<string>('')

  // Определение города по IP при первой загрузке
  useEffect(() => {
    const detectedCity = localStorage.getItem('detectedCity')
    const userChangedCity = localStorage.getItem('userChangedCity') === 'true'
    
    // Если пользователь уже выбрал город вручную, не переопределяем
    if (userChangedCity && detectedCity) {
      setFilters({ city: detectedCity })
      setGeoDetected(true)
      return
    }
    
    // Если город уже был определен ранее, используем его
    if (detectedCity) {
      setFilters({ city: detectedCity })
      setGeoDetected(true)
      return
    }
    
    // Определяем город по IP
    fetch('/api/geolocation')
      .then((res) => res.json())
      .then((data) => {
        if (data.citySlug) {
          setFilters({ city: data.citySlug })
          localStorage.setItem('detectedCity', data.citySlug)
          setGeoDetected(true)
        } else {
          // Если не удалось определить город, продолжаем без фильтра
          setGeoDetected(true)
        }
      })
      .catch((error) => {
        console.error('Error detecting city:', error)
        setGeoDetected(true) // Все равно продолжаем, просто без автофильтра
      })
  }, [])

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
  useEffect(() => {
    // Не загружаем, пока не определили город
    if (!geoDetected) {
      return
    }

    // Создаем ключ для текущих фильтров
    const filtersKey = `${searchQuery}|${filters.city || ''}|${filters.category || ''}`
    
    // Если фильтры не изменились и уже идет загрузка, пропускаем
    if (filtersKey === lastFiltersRef.current && loadingRef.current) {
      return
    }

    // Предотвращаем множественные одновременные запросы
    if (loadingRef.current) {
      return
    }

    loadingRef.current = true
    lastFiltersRef.current = filtersKey
    setLoading(true)

    const params = new URLSearchParams({
      page: '1',
      limit: '12',
    })
    
    if (searchQuery) params.append('search', searchQuery)
    if (filters.city) params.append('city', filters.city)
    if (filters.category) params.append('category', filters.category)

    fetch(`/api/businesses?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch businesses: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const businessesList = data?.businesses || []
        const pagination = data?.pagination || { page: 1, totalPages: 1 }
        
        setBusinesses(businessesList)
        setPage(1)
        setHasMore(pagination.page < pagination.totalPages)
        loadingRef.current = false
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading businesses:', error)
        setBusinesses([])
        loadingRef.current = false
        setLoading(false)
      })
  }, [geoDetected, searchQuery, filters.city, filters.category])

  // Загрузка следующей страницы (только при изменении page > 1)
  useEffect(() => {
    if (!geoDetected || page <= 1 || loadingRef.current) {
      return
    }

    loadingRef.current = true
    setLoading(true)

    const params = new URLSearchParams({
      page: page.toString(),
      limit: '12',
    })
    
    if (searchQuery) params.append('search', searchQuery)
    if (filters.city) params.append('city', filters.city)
    if (filters.category) params.append('category', filters.category)

    fetch(`/api/businesses?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch businesses: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const businessesList = data?.businesses || []
        const pagination = data?.pagination || { page: 1, totalPages: 1 }
        
        setBusinesses((prev) => [...prev, ...businessesList])
        setHasMore(pagination.page < pagination.totalPages)
        loadingRef.current = false
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading businesses:', error)
        loadingRef.current = false
        setLoading(false)
      })
  }, [page, geoDetected, searchQuery, filters.city, filters.category])

  // Обработчик изменения фильтров (когда пользователь выбирает вручную)
  const handleFilterChange = (newFilters: { city?: string; category?: string }) => {
    // Помечаем, что пользователь изменил город вручную
    if (newFilters.city && newFilters.city !== filters.city) {
      localStorage.setItem('userChangedCity', 'true')
      localStorage.setItem('detectedCity', newFilters.city)
    }
    setFilters(newFilters)
  }

  const handleLoadMore = () => {
    setPage((p) => p + 1)
  }

  return (
    <section className="mb-12">
      {/* Поиск и фильтры */}
      <div className="mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={handleFilterChange}
          cities={cities}
          categories={categories}
          locale={locale}
          sticky={true}
          initialCity={filters.city}
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
      {!loading && businesses.length === 0 && geoDetected && (
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
