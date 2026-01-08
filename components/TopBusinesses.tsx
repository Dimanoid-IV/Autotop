'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { BusinessCard } from './BusinessCard'
import { Award } from 'lucide-react'

interface TopBusinessesProps {
  locale: string
}

export function TopBusinesses({ locale }: TopBusinessesProps) {
  const t = useTranslations('top10')
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

    fetch(`/api/top-businesses?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch top businesses')
        }
        return res.json()
      })
      .then((data) => {
        // Ensure data is an array
        const businessesList = Array.isArray(data) ? data : []
        setBusinesses(businessesList)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading top businesses:', error)
        setBusinesses([])
        setLoading(false)
      })
  }, [citySlug])

  if (loading) {
    return null
  }

  if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t('title')} {t('inCity')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.slice(0, 10).map((business, index) => (
          <div key={business.id} className="relative">
            {index < 3 && (
              <div className="absolute -top-2 -left-2 bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>
            )}
            <BusinessCard business={business} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  )
}

