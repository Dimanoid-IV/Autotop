import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '3')

    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching latest reviews:', error)
    // Return empty array instead of error for better UX
    return NextResponse.json([])
  }
}

