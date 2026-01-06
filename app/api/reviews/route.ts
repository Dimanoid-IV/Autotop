import { NextRequest, NextResponse } from 'next/server'
import { sendReviewModerationEmail } from '@/lib/email'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
  businessId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { getServerSession } = await import('next-auth')
    const { getAuthOptions } = await import('@/lib/auth')
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        userId: session.user.id,
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
        userId: session.user.id,
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


