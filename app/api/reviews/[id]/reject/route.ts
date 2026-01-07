import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verify JWT token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { prisma } = await import('@/lib/prisma')

    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    await prisma.review.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    })

    return NextResponse.json({ success: true, message: 'Review rejected' })
  } catch (error) {
    console.error('Error rejecting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


