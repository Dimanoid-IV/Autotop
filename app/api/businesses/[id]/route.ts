import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Проверяем наличие DATABASE_URL перед импортом Prisma
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        city: true,
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: { status: 'APPROVED' },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!business) {
      console.error(`Business with id ${id} not found in database`)
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const approvedReviews = business.reviews.filter(
      (r) => r.status === 'APPROVED'
    )
    const avgRating =
      approvedReviews.length > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
          approvedReviews.length
        : 0

    return NextResponse.json({
      ...business,
      rating: avgRating,
      reviewCount: approvedReviews.length,
    })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


