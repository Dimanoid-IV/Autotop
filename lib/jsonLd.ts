import { getBaseUrl } from './url'

export function generateBusinessSchema(business: any, locale: string) {
  const isRu = locale === 'ru'
  const cityName = isRu ? business.city?.nameRu : business.city?.nameEt
  const categoryName = isRu ? business.category?.nameRu : business.category?.nameEt
  
  const reviews = business.reviews?.filter((r: any) => r.status === 'APPROVED') || []
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0
  
  const baseUrl = getBaseUrl()
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${baseUrl}/${locale}/businesses/${business.id}`,
    name: business.name,
    description: business.description || undefined,
    image: business.logo || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || '',
      addressLocality: cityName || '',
      addressCountry: 'EE',
    },
    priceRange: '$$',
  }
  
  // Добавляем координаты, если есть
  if (business.latitude && business.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    }
  }
  
  // Добавляем телефон, если есть
  if (business.phone) {
    schema.telephone = business.phone
  }
  
  // Добавляем сайт, если есть
  if (business.website) {
    schema.url = business.website
  }
  
  // Добавляем рейтинг, если есть отзывы
  if (reviews.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    }
    
    // Добавляем последние 5 отзывов
    schema.review = reviews.slice(0, 5).map((review: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user?.name || 'Anonymous',
      },
      datePublished: review.createdAt,
      reviewBody: review.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    }))
  }
  
  return schema
}

export function generateWebsiteSchema(locale: string) {
  const isRu = locale === 'ru'
  const baseUrl = getBaseUrl()
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AutoTop',
    alternateName: isRu ? 'АвтоТоп' : 'AutoTop',
    url: `${baseUrl}/${locale}`,
    description: isRu
      ? 'Рейтинги и отзывы автосервисов в Эстонии'
      : 'Autoteenuste hinnangud ja arvustused Eestis',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
