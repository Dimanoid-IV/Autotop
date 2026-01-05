import { NextRequest } from 'next/server'

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
    const handler = NextAuth(authOptions)
    
    // NextAuth v4 возвращает объект с методами GET и POST для App Router
    return handler
  } catch (error) {
    console.error('Failed to initialize NextAuth:', error)
    // Возвращаем заглушку с методами GET и POST
    const errorResponse = new Response(
      JSON.stringify({ error: 'Authentication service unavailable. Please check environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
    return {
      GET: () => errorResponse,
      POST: () => errorResponse,
    } as any
  }
}

let handler: Awaited<ReturnType<typeof getHandler>> | null = null

export async function GET(req: NextRequest) {
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

    // NextAuth v4 handler для App Router - это объект с методами GET и POST
    return await handler.GET(req as any)
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

export async function POST(req: NextRequest) {
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

    // NextAuth v4 handler для App Router - это объект с методами GET и POST
    return await handler.POST(req as any)
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
