import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const verifySchema = z.object({
  token: z.string(),
  email: z.string().email(),
})

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { searchParams } = new URL(request.url)
    
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?error=missing_params', request.url)
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?error=invalid_token', request.url)
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?error=expired_token', request.url)
      )
    }

    // Check if email matches
    if (verificationToken.identifier !== email) {
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?error=invalid_email', request.url)
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?error=user_not_found', request.url)
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      // Delete token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.redirect(
        new URL('/ru/auth/verify-email?success=already_verified', request.url)
      )
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.redirect(
      new URL('/ru/auth/verify-email?success=verified', request.url)
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(
      new URL('/ru/auth/verify-email?error=server_error', request.url)
    )
  }
}



