'use client'

import { useState, useEffect } from 'react'
import { BusinessCard } from './BusinessCard'

interface FeaturedBusinessesProps {
  locale: string
}

export function FeaturedBusinesses({ locale }: FeaturedBusinessesProps) {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [citySlug, setCitySlug] = useState<string | null>(null)

  // Получаем определенный город из localStorage
  useEffect(() => {
    const detectedCity = localStorage.getItem('detectedCity')
    setCitySlug(detectedCity)
  }, [])

  useEffect(() => {
    // Если город еще не определен, ждем немного
    if (citySlug === null) {
      // Проверяем еще раз через небольшую задержку
      const timer = setTimeout(() => {
        const detectedCity = localStorage.getItem('detectedCity')
        setCitySlug(detectedCity || '')
      }, 1000)
      return () => clearTimeout(timer)
    }

    const params = new URLSearchParams()
    if (citySlug) {
      params.append('city', citySlug)
    }

    fetch(`/api/businesses?${params.toString()}&limit=6&featured=true`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch featured businesses')
        }
        return res.json()
      })
      .then((data) => {
        const featured = (data?.businesses || []).slice(0, 6)
        setBusinesses(featured)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading featured businesses:', error)
        setBusinesses([])
        setLoading(false)
      })
  }, [citySlug])

  if (loading) {
    return null
  }

  if (businesses.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header с меткой "Реклама" */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {locale === 'ru' ? 'Рекомендуемые автосервисы' : 'Soovitatud autoteenused'}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {locale === 'ru' ? 'Реклама' : 'Reklaam'}
        </span>
      </div>

      {/* Выделенная рамка */}
      <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div key={business.id} className="relative">
              {/* Premium Badge */}
              <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                TOP
              </div>
              <BusinessCard business={business} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Дисклеймер */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        {locale === 'ru' 
          ? 'Компании отмечены как "TOP" оплатили размещение в этом блоке. Порядок показа произвольный.'
          : 'Ettevõtted märgitud "TOP" maksis paigutuse selles plokis. Järjekord on juhuslik.'}
      </p>
    </section>
  )
}
