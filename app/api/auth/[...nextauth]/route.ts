export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getHandler() {
  try {
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
    return NextAuth(authOptions)
  } catch (error) {
    console.error('Failed to initialize NextAuth:', error)
    // Возвращаем заглушку, которая всегда возвращает ошибку
    return {
      GET: () => new Response(
        JSON.stringify({ error: 'Authentication service unavailable. Please check environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ),
      POST: () => new Response(
        JSON.stringify({ error: 'Authentication service unavailable. Please check environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ),
    } as any
  }
}

let handler: Awaited<ReturnType<typeof getHandler>> | null = null

export async function GET(req: Request) {
  try {
    // Проверяем переменные окружения перед инициализацией
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: 'NEXTAUTH_SECRET environment variable is not set'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: 'DATABASE_URL environment variable is not set'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!handler) {
      handler = await getHandler()
    }

    // NextAuth handler ожидает Request объект напрямую
    // В Next.js 14 App Router это должно работать правильно
    try {
      const response = await (handler as any)(req)
      return response
    } catch (handlerError) {
      console.error('NextAuth handler error:', handlerError)
      // Если handler выбрасывает ошибку, возвращаем валидный JSON
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: handlerError instanceof Error ? handlerError.message : 'Handler error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Authentication service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Проверяем переменные окружения перед инициализацией
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: 'NEXTAUTH_SECRET environment variable is not set'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: 'DATABASE_URL environment variable is not set'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!handler) {
      handler = await getHandler()
    }

    // NextAuth handler ожидает Request объект напрямую
    // В Next.js 14 App Router это должно работать правильно
    try {
      const response = await (handler as any)(req)
      return response
    } catch (handlerError) {
      console.error('NextAuth handler error:', handlerError)
      // Если handler выбрасывает ошибку, возвращаем валидный JSON
      return new Response(
        JSON.stringify({ 
          error: 'Authentication service unavailable',
          message: handlerError instanceof Error ? handlerError.message : 'Handler error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Authentication service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
