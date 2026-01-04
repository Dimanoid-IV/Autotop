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
  if (!handler) {
    handler = await getHandler()
  }
  return (handler as any)(req)
}

export async function POST(req: Request) {
  if (!handler) {
    handler = await getHandler()
  }
  return (handler as any)(req)
}
