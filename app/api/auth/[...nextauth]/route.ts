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
    if (!handler) {
      handler = await getHandler()
    }
    return (handler as any)(req)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return new Response(
      JSON.stringify({ error: 'Authentication service unavailable' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    if (!handler) {
      handler = await getHandler()
    }
    return (handler as any)(req)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return new Response(
      JSON.stringify({ error: 'Authentication service unavailable' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
