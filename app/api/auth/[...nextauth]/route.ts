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
    return NextAuth(authOptions)
  } catch (error) {
    console.error('Failed to initialize NextAuth:', error)
    // Возвращаем функцию-заглушку, которая всегда возвращает ошибку
    return async () => new Response(
      JSON.stringify({ error: 'Authentication service unavailable. Please check environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
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

    // NextAuth v4 handler - это функция, которая принимает Request и возвращает Response
    // В App Router NextAuth автоматически обрабатывает NextRequest
    const response = await handler(req as any)
    return response
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

    // NextAuth v4 handler - это функция, которая принимает Request и возвращает Response
    // В App Router NextAuth автоматически обрабатывает NextRequest
    const response = await handler(req as any)
    return response
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
