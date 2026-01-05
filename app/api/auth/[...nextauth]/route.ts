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
  
  // NextAuth v4 в App Router возвращает объект с методами GET и POST
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

export async function GET(req: NextRequest) {
  try {
    // Проверяем переменные окружения
    if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) {
      return errorResponse('Required environment variables are not set')
    }

    const authHandler = await getHandler()
    
    // NextAuth v4 в App Router возвращает объект с методами GET и POST
    // Проверяем, есть ли метод GET
    if (authHandler && typeof authHandler === 'function') {
      // Если handler - функция, вызываем её напрямую
      return await authHandler(req as any)
    } else if (authHandler && typeof authHandler.GET === 'function') {
      // Если handler - объект с методом GET
      return await authHandler.GET(req as any)
    } else {
      // Fallback: пытаемся вызвать как функцию
      return await (authHandler as any)(req)
    }
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

    const authHandler = await getHandler()
    
    // NextAuth v4 в App Router возвращает объект с методами GET и POST
    // Проверяем, есть ли метод POST
    if (authHandler && typeof authHandler === 'function') {
      // Если handler - функция, вызываем её напрямую
      return await authHandler(req as any)
    } else if (authHandler && typeof authHandler.POST === 'function') {
      // Если handler - объект с методом POST
      return await authHandler.POST(req as any)
    } else {
      // Fallback: пытаемся вызвать как функцию
      return await (authHandler as any)(req)
    }
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
