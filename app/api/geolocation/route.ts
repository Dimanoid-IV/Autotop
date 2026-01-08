import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Маппинг городов Эстонии для сопоставления с названиями из IP API
const CITY_MAPPING: Record<string, string[]> = {
  'tallinn': ['tallinn', 'таллинн', 'таллин', 'reval'],
  'tartu': ['tartu', 'тарту', 'dorpat', 'yuryev'],
  'narva': ['narva', 'нарва'],
  'parnu': ['pärnu', 'parnu', 'парну', 'парн', 'pernau'],
  'viljandi': ['viljandi', 'вильянди', 'феллин'],
  'rakvere': ['rakvere', 'раквере', 'везенберг'],
  'maardu': ['maardu', 'маарду'],
  'kuressaare': ['kuressaare', 'курессааре', 'аrensburg'],
  'voru': ['võru', 'voru', 'выру'],
  'valga': ['valga', 'валга'],
  'johvi': ['jõhvi', 'johvi', 'йыхви'],
  'haapsalu': ['haapsalu', 'хаапсалу', 'гапсаль'],
  'paide': ['paide', 'пяйде'],
  'keila': ['keila', 'кейла'],
  'tapa': ['tapa', 'тапа'],
}

function normalizeCityName(cityName: string): string {
  return cityName.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function detectCityFromIP(ip: string): Promise<string | null> {
  try {
    // Используем бесплатный API ipapi.co (15,000 запросов/месяц бесплатно)
    // Альтернатива: ip-api.com (45 запросов/минуту бесплатно)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'AutoTop-GeoLocation',
      },
      // Добавляем таймаут
      signal: AbortSignal.timeout(5000),
    })
    
    if (!response.ok) {
      console.error('IP geolocation API error:', response.status)
      return null
    }
    
    const data = await response.json()
    
    // Проверяем ошибки от API
    if (data.error) {
      console.error('IP API error:', data.reason)
      return null
    }
    
    // Проверяем, что это Эстония
    if (data.country_code !== 'EE') {
      console.log('User is not in Estonia, country:', data.country_code)
      return null
    }
    
    const detectedCity = normalizeCityName(data.city || '')
    console.log('Detected city from IP:', detectedCity)
    
    // Если город не определен, пытаемся использовать регион
    const region = detectedCity || normalizeCityName(data.region || '')
    
    // Ищем соответствие в базе данных
    const cities = await prisma.city.findMany({
      select: { slug: true, nameEt: true, nameRu: true },
    })
    
    for (const city of cities) {
      const cityNameEt = normalizeCityName(city.nameEt)
      const cityNameRu = normalizeCityName(city.nameRu)
      
      // Точное совпадение
      if (detectedCity === cityNameEt || detectedCity === cityNameRu) {
        console.log('City matched:', city.slug)
        return city.slug
      }
      
      // Частичное совпадение
      if (detectedCity.includes(cityNameEt) || detectedCity.includes(cityNameRu)) {
        console.log('City matched (partial):', city.slug)
        return city.slug
      }
      
      // Проверяем маппинг
      if (CITY_MAPPING[city.slug]) {
        if (CITY_MAPPING[city.slug].some(name => {
          const normalizedName = normalizeCityName(name)
          return detectedCity.includes(normalizedName) || normalizedName.includes(detectedCity)
        })) {
          console.log('City matched (mapping):', city.slug)
          return city.slug
        }
      }
    }
    
    console.log('City not found in database for:', detectedCity)
    return null
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('IP geolocation request timeout')
    } else {
      console.error('Error detecting city from IP:', error)
    }
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Получаем IP адрес пользователя
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
    
    let ip = forwarded 
      ? forwarded.split(',')[0].trim() 
      : realIp || cfConnectingIp || request.ip || '127.0.0.1'
    
    // Очищаем IP от порта, если есть
    if (ip.includes(':')) {
      ip = ip.split(':')[0]
    }
    
    // Для localhost в разработке - можно вернуть тестовый город
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      // В разработке возвращаем null или можно вернуть 'tallinn' для тестирования
      const testCity = process.env.NODE_ENV === 'development' ? process.env.DEV_TEST_CITY || null : null
      return NextResponse.json({ 
        citySlug: testCity,
        message: 'Local network detected',
        ip: 'local',
      })
    }
    
    const citySlug = await detectCityFromIP(ip)
    
    return NextResponse.json({ 
      citySlug,
      ip: ip.substring(0, 7) + '***', // Частично скрываем IP для логирования
    })
  } catch (error) {
    console.error('Error in geolocation API:', error)
    return NextResponse.json(
      { citySlug: null, error: 'Failed to detect location' },
      { status: 500 }
    )
  }
}
