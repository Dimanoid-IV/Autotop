import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { sendReviewModerationEmail } from '@/lib/email'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
  businessId: z.string(),
})

// GET all reviews (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const { prisma } = await import('@/lib/prisma')
    
    const where: any = {}
    if (status) {
      where.status = status
    }
    
    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    
    const userId = payload.id as string
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { prisma } = await import('@/lib/prisma')
    
    const body = await request.json()
    const { rating, comment, businessId } = reviewSchema.parse(body)

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { city: true },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Check if user already reviewed this business
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        businessId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this business' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        businessId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Send moderation email
    const locale = request.headers.get('accept-language')?.includes('ru')
      ? 'ru'
      : 'et'
    await sendReviewModerationEmail(
      review.id,
      business.name,
      review.user.name || review.user.email,
      rating,
      comment,
      locale
    )

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


