import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, create new user and send verification email
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10)
      
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          emailVerified: null, // NOT verified yet
          role: 'USER',
        },
      })

      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date()
      expires.setHours(expires.getHours() + 24) // 24 hours

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      // Send verification email
      try {
        await sendVerificationEmail(email, token, 'ru')
      } catch (emailError) {
        console.error('Error sending verification email:', emailError)
        // Don't fail registration if email fails
      }

      return NextResponse.json({
        success: false,
        needsVerification: true,
        message: 'Please check your email to verify your account before signing in.',
      })
    }

    // User exists - check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please verify your email before signing in. Check your inbox for the verification link.',
        },
        { status: 403 }
      )
    }

    // User exists and verified - check password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


