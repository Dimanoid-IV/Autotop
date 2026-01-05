import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET endpoint is public - unregistered users can view businesses
export async function GET(request: NextRequest) {
  try {
    // Check DATABASE_URL before importing Prisma
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        {
          businesses: [],
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
          },
          error: 'Database connection not configured',
        },
        { status: 500 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {}

    if (city) {
      where.city = { slug: city }
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          city: true,
          category: true,
          reviews: {
            where: { status: 'APPROVED' },
          },
        },
        orderBy: [
          { verified: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ])

    console.log(`Found ${businesses.length} businesses, total: ${total}`)

    const businessesWithRating = businesses.map((business) => {
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
        latitude: business.latitude,
        longitude: business.longitude,
        phone: business.phone,
        website: business.website,
        email: business.email,
        verified: business.verified,
        city: business.city,
        category: business.category,
        rating: avgRating,
        reviewCount: approvedReviews.length,
      }
    })

    return NextResponse.json({
      businesses: businessesWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    // Log full error for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // Return empty result instead of error for better UX
    return NextResponse.json({
      businesses: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { getServerSession } = await import('next-auth')
    const { getAuthOptions } = await import('@/lib/auth')
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      name,
      description,
      address,
      latitude,
      longitude,
      phone,
      website,
      email,
      cityId,
      categoryId,
    } = body

    if (!name || !address || !cityId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        phone,
        website,
        email,
        cityId,
        categoryId,
        ownerId: session?.user?.id || null,
      },
      include: {
        city: true,
        category: true,
      },
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

