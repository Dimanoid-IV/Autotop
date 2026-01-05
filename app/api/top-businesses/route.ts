import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const citySlug = searchParams.get('city')

    const where: any = {}
    if (citySlug) {
      where.city = { slug: citySlug }
    }

    const businesses = await prisma.business.findMany({
      where,
      include: {
        city: true,
        category: true,
        reviews: {
          where: { status: 'APPROVED' },
        },
      },
      take: 10,
    })

    const businessesWithRating = businesses
      .map((business) => {
        const approvedReviews = business.reviews.filter(
          (r) => r.status === 'APPROVED'
        )
        const avgRating =
          approvedReviews.length > 0
            ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
              approvedReviews.length
            : 0

        return {
          id: business.id,
          name: business.name,
          description: business.description,
          address: business.address,
          city: business.city,
          category: business.category,
          rating: avgRating,
          reviewCount: approvedReviews.length,
          verified: business.verified,
        }
      })
      .filter((b) => b.reviewCount > 0)
      .sort((a, b) => {
        // Sort by rating first, then by review count
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.reviewCount - a.reviewCount
      })
      .slice(0, 10)

    return NextResponse.json(businessesWithRating)
  } catch (error) {
    console.error('Error fetching top businesses:', error)
    // Return empty array instead of error for better UX
    return NextResponse.json([])
  }
}

