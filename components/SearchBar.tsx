'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Filter } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange?: (filters: { city?: string; category?: string }) => void
  cities?: Array<{ id: string; name: string; nameEt: string; nameRu: string; slug: string }>
  categories?: Array<{ id: string; nameEt: string; nameRu: string; slug: string }>
  locale: string
  sticky?: boolean
}

export function SearchBar({
  onSearch,
  onFilterChange,
  cities = [],
  categories = [],
  locale,
  sticky = false,
}: SearchBarProps) {
  const t = useTranslations('common')
  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    onSearch(query)
  }, [query, onSearch])

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        city: selectedCity || undefined,
        category: selectedCategory || undefined,
      })
    }
  }, [selectedCity, selectedCategory, onFilterChange])

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 ${
        sticky ? 'sticky top-16 z-40' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span className="hidden md:inline">{t('search')}</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{locale === 'ru' ? 'Все города' : 'Kõik linnad'}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {locale === 'ru' ? city.nameRu : city.nameEt}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{locale === 'ru' ? 'Все категории' : 'Kõik kategooriad'}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {locale === 'ru' ? category.nameRu : category.nameEt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

