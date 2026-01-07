import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not set')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=Configuration`)
    }
    
    // Build Google OAuth URL manually
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', clientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'openid email profile')
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'consent')
    googleAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify({ callbackUrl })).toString('base64'))
    
    console.log('🔗 Redirecting to Google OAuth:', googleAuthUrl.toString().substring(0, 100) + '...')
    
    return NextResponse.redirect(googleAuthUrl.toString())
  } catch (error) {
    console.error('Error in Google OAuth:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=OAuthError`)
  }
}

