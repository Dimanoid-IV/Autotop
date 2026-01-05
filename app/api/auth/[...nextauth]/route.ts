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
  
  // NextAuth v4 в App Router возвращает объект с методами GET и POST
  const handler = NextAuth(authOptions)
  
  // Проверяем формат handler и извлекаем GET и POST
  if (handler && typeof handler === 'object' && 'GET' in handler && 'POST' in handler) {
    handlers = {
      GET: handler.GET,
      POST: handler.POST,
    }
  } else if (handler && typeof handler === 'function') {
    // Если handler - функция, оборачиваем её в объект
    handlers = {
      GET: handler,
      POST: handler,
    }
  } else {
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

export async function GET(req: Request) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    const { GET: handlerGET } = await getHandlers()
    return await handlerGET(req)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export async function POST(req: Request) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    const { POST: handlerPOST } = await getHandlers()
    return await handlerPOST(req)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
