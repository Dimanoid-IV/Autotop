import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendReplyModerationEmail } from '@/lib/email'
import { z } from 'zod'

const replySchema = z.object({
  comment: z.string().min(1),
  reviewId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { comment, reviewId } = replySchema.parse(body)

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        business: {
          include: {
            owner: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user is the business owner
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (
      review.business.ownerId !== session.user.id &&
      user?.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Only business owners can reply to reviews' },
        { status: 403 }
      )
    }

    const reply = await prisma.reviewReply.create({
      data: {
        comment,
        userId: session.user.id,
        reviewId,
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
    await sendReplyModerationEmail(
      reply.id,
      review.business.name,
      reply.user.name || reply.user.email,
      comment,
      locale
    )

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


