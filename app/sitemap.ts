import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getBaseUrl } from '@/lib/url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  
  const now = new Date()
  
  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/et`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ru`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/et/advertise`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ru/advertise`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
  
  try {
    // Получаем все бизнесы
    const businesses = await prisma.business.findMany({
      select: { 
        id: true, 
        updatedAt: true 
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    // Страницы бизнесов для обеих локалей
    const businessPages: MetadataRoute.Sitemap = businesses.flatMap((business) => [
      {
        url: `${baseUrl}/et/businesses/${business.id}`,
        lastModified: business.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/ru/businesses/${business.id}`,
        lastModified: business.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
    ])
    
    return [...staticPages, ...businessPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Если база данных недоступна, возвращаем только статические страницы
    return staticPages
  }
}
