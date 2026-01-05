import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Ленивая инициализация NextAuth handler
let handlers: { GET: any; POST: any } | null = null

async function getHandlers() {
  if (handlers) {
    return handlers
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
  
  // NextAuth v4 в App Router - используем правильный синтаксис экспорта
  const handler = NextAuth(authOptions)
  
  // NextAuth v4 возвращает объект с handlers
  if (handler && typeof handler === 'object') {
    if ('handlers' in handler && handler.handlers) {
      // Если есть handlers объект
      handlers = {
        GET: handler.handlers.GET,
        POST: handler.handlers.POST,
      }
    } else if ('GET' in handler && 'POST' in handler) {
      // Если методы GET и POST напрямую в handler
      handlers = {
        GET: handler.GET,
        POST: handler.POST,
      }
    } else if (typeof handler === 'function') {
      // Если handler - функция (старый формат)
      handlers = {
        GET: handler,
        POST: handler,
      }
    }
  }
  
  if (!handlers) {
    throw new Error('NextAuth handler is not in expected format')
  }
  
  return handlers
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

// Адаптер для преобразования NextRequest в формат, который понимает NextAuth
function adaptRequest(req: NextRequest): Request {
  // Создаем новый Request с правильным URL
  const url = new URL(req.url)
  // NextAuth ожидает query параметры в определенном формате
  // Извлекаем параметры из пути [...nextauth]
  const pathParts = url.pathname.split('/')
  const nextauthIndex = pathParts.indexOf('nextauth')
  if (nextauthIndex !== -1 && pathParts[nextauthIndex + 1]) {
    // Добавляем параметр nextauth в query
    url.searchParams.set('nextauth', pathParts.slice(nextauthIndex + 1).join('/'))
  }
  
  return new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  })
}

export async function GET(req: NextRequest) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    const { GET: handlerGET } = await getHandlers()
    // Преобразуем NextRequest в Request для NextAuth
    const adaptedReq = adaptRequest(req)
    return await handlerGET(adaptedReq)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    const { POST: handlerPOST } = await getHandlers()
    // Преобразуем NextRequest в Request для NextAuth
    const adaptedReq = adaptRequest(req)
    return await handlerPOST(adaptedReq)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
