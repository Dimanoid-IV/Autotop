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
    const categories = await prisma.category.findMany({
      orderBy: { nameEt: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    // Return empty array instead of error for better UX
    return NextResponse.json([], { status: 200 })
  }
}


