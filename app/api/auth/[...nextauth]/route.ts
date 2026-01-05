export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getHandler() {
  const NextAuth = (await import('next-auth')).default
  const { getAuthOptions } = await import('@/lib/auth')
  const authOptions = await getAuthOptions()
  return NextAuth(authOptions)
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
