import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json([], { status: 200 })
    }

    const { prisma } = await import('@/lib/prisma')
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    // Return empty array instead of error for better UX
    return NextResponse.json([], { status: 200 })
  }
}


