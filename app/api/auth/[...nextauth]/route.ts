import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Ленивая инициализация NextAuth handler
async function createHandler() {
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
  const handler = NextAuth(authOptions)
  
  // NextAuth v4 возвращает функцию, которая принимает Request и возвращает Response
  // В App Router нужно обернуть её в методы GET и POST
  return handler
}

let _handler: Awaited<ReturnType<typeof createHandler>> | null = null

async function getHandler() {
  if (!_handler) {
    _handler = await createHandler()
  }
  return _handler
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

    const handler = await getHandler()
    
    // NextAuth handler - это функция, которая принимает Request
    // В App Router она автоматически обрабатывает NextRequest
    return await handler(req as any)
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

    const handler = await getHandler()
    
    // NextAuth handler - это функция, которая принимает Request
    // В App Router она автоматически обрабатывает NextRequest
    return await handler(req as any)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
