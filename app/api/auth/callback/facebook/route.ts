import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('Facebook OAuth callback received:', { hasCode: !!code, error })

    if (error) {
      console.error('Facebook OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=OAuthError`)
    }

    if (!code) {
      console.error('No authorization code received')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=NoCode`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Note: Facebook uses GET for token exchange with query params
    })

    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_CLIENT_ID!)
    tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_CLIENT_SECRET!)
    tokenUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`)
    tokenUrl.searchParams.set('code', code)

    const tokenResp = await fetch(tokenUrl.toString())

    if (!tokenResp.ok) {
      const errorData = await tokenResp.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=TokenExchange`)
    }

    const tokens = await tokenResp.json()
    console.log('Tokens received, fetching user info...')

    // Get user info from Facebook
    const userInfoUrl = new URL('https://graph.facebook.com/me')
    userInfoUrl.searchParams.set('fields', 'id,name,email,picture')
    userInfoUrl.searchParams.set('access_token', tokens.access_token)

    const userInfoResponse = await fetch(userInfoUrl.toString())

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=UserInfo`)
    }

    const facebookUser = await userInfoResponse.json()
    console.log('Facebook user info:', { email: facebookUser.email, name: facebookUser.name })

    // Check if user provided email
    if (!facebookUser.email) {
      console.error('Facebook user has no email')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=NoEmail`)
    }

    // Create or update user in database
    const { prisma } = await import('@/lib/prisma')
    
    let user = await prisma.user.findUnique({
      where: { email: facebookUser.email },
    })

    const userImage = facebookUser.picture?.data?.url || null

    if (!user) {
      console.log('Creating new user...')
      user = await prisma.user.create({
        data: {
          email: facebookUser.email,
          name: facebookUser.name || facebookUser.email.split('@')[0],
          image: userImage,
          emailVerified: new Date(), // Facebook emails are already verified
        },
      })
    } else {
      console.log('Updating existing user...')
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: facebookUser.name || user.name,
          image: userImage || user.image,
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

    console.log('✅ Facebook OAuth successful, redirecting to:', callbackUrl)
    return response
  } catch (error) {
    console.error('Facebook OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=ServerError`)
  }
}

