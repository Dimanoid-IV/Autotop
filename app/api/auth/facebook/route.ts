import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    
    const clientId = process.env.FACEBOOK_CLIENT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`
    
    if (!clientId) {
      console.error('FACEBOOK_CLIENT_ID is not set')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=Configuration`)
    }
    
    // Build Facebook OAuth URL
    const facebookAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
    facebookAuthUrl.searchParams.set('client_id', clientId)
    facebookAuthUrl.searchParams.set('redirect_uri', redirectUri)
    facebookAuthUrl.searchParams.set('response_type', 'code')
    facebookAuthUrl.searchParams.set('scope', 'email,public_profile')
    facebookAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify({ callbackUrl })).toString('base64'))
    
    console.log('🔗 Redirecting to Facebook OAuth')
    
    return NextResponse.redirect(facebookAuthUrl.toString())
  } catch (error) {
    console.error('Error in Facebook OAuth:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ru/auth/signin?error=OAuthError`)
  }
}

