import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('Google OAuth callback received:', { hasCode: !!code, error })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=OAuthError`)
    }

    if (!code) {
      console.error('No authorization code received')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=NoCode`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=TokenExchange`)
    }

    const tokens = await tokenResponse.json()
    console.log('Tokens received, fetching user info...')

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=UserInfo`)
    }

    const googleUser = await userInfoResponse.json()
    console.log('Google user info:', { email: googleUser.email, name: googleUser.name })

    // Create or update user in database
    const { prisma } = await import('@/lib/prisma')
    
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      console.log('Creating new user...')
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split('@')[0],
          image: googleUser.picture,
          emailVerified: new Date(), // Google emails are already verified
        },
      })
    } else {
      console.log('Updating existing user...')
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name || user.name,
          image: googleUser.picture || user.image,
          emailVerified: user.emailVerified || new Date(),
        },
      })
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    // Parse callback URL from state
    let callbackUrl = '/'
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
        callbackUrl = stateData.callbackUrl || '/'
      } catch (e) {
        console.warn('Failed to parse state:', e)
      }
    }

    // Set cookie and redirect
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}${callbackUrl}`)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('✅ Google OAuth successful, redirecting to:', callbackUrl)
    return response
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=ServerError`)
  }
}

