'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from './SearchBar'

interface SearchSectionProps {
  locale: string
}

export function SearchSection({ locale }: SearchSectionProps) {
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ city?: string; category?: string }>({})

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

  return (
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
  )
}





