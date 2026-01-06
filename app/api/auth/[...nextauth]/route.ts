import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Ленивая инициализация NextAuth handler
let handler: any = null

async function getHandler() {
  if (handler) {
    return handler
  }

  // Проверяем обязательные переменные перед инициализацией
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not set')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const NextAuth = (await import('next-auth')).default
  const { getAuthOptions } = await import('@/lib/auth')
  const authOptions = await getAuthOptions()
  
  // NextAuth v4 в App Router - создаем handler
  handler = NextAuth(authOptions)
  
  return handler
}

// Обработчик ошибок для возврата валидного ответа
function errorResponse(message: string) {
  return new Response(
    JSON.stringify({ 
      error: 'Authentication service unavailable',
      message 
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// Адаптер для преобразования NextRequest в формат, который понимает NextAuth v4
// NextAuth v4 ожидает объект с query параметрами в формате Pages Router
async function adaptRequestForNextAuth(
  req: NextRequest, 
  params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }>
) {
  const url = new URL(req.url)
  
  // Параметры могут быть промисом в новых версиях Next.js
  const resolvedParams = await Promise.resolve(params)
  
  // Извлекаем параметры nextauth из URL, если они не переданы через params
  let nextauthParams: string[] = resolvedParams?.nextauth || []
  
  // Если параметры не переданы, извлекаем их из URL
  if (!nextauthParams || nextauthParams.length === 0) {
    const pathParts = url.pathname.split('/')
    const authIndex = pathParts.indexOf('auth')
    if (authIndex !== -1 && authIndex < pathParts.length - 1) {
      nextauthParams = pathParts.slice(authIndex + 1)
    }
  }
  
  // Создаем объект запроса в формате, который ожидает NextAuth v4
  // NextAuth v4 ожидает объект с методом, query, headers и body
  const adaptedReq: any = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: {
      nextauth: nextauthParams
    },
    url: url.toString(),
  }
  
  return adaptedReq
}

export async function GET(
  req: NextRequest,
  context: { params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }> }
) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      handler = await getHandler()
    }
    
    // Адаптируем запрос для NextAuth v4
    const adaptedReq = await adaptRequestForNextAuth(req, context.params)
    
    // NextAuth v4 handler вызывается как функция с адаптированным запросом
    return await handler(adaptedReq)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { nextauth?: string[] } | Promise<{ nextauth?: string[] }> }
) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    if (!handler) {
      handler = await getHandler()
    }
    
    // Читаем body для POST запросов
    const body = await req.text()
    
    // Адаптируем запрос для NextAuth v4
    const adaptedReq = await adaptRequestForNextAuth(req, context.params)
    adaptedReq.body = body
    
    // NextAuth v4 handler вызывается как функция с адаптированным запросом
    return await handler(adaptedReq)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
