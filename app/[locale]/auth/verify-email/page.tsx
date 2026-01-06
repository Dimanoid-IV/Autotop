'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')

    if (success === 'verified') {
      setStatus('success')
      setMessage('Your email has been verified successfully! You can now sign in.')
    } else if (success === 'already_verified') {
      setStatus('success')
      setMessage('Your email is already verified. You can sign in.')
    } else if (error === 'missing_params') {
      setStatus('error')
      setMessage('Missing verification parameters. Please check your email link.')
    } else if (error === 'invalid_token') {
      setStatus('error')
      setMessage('Invalid verification token. Please request a new verification email.')
    } else if (error === 'expired_token') {
      setStatus('error')
      setMessage('Verification token has expired. Please request a new verification email.')
    } else if (error === 'invalid_email') {
      setStatus('error')
      setMessage('Email does not match the verification token.')
    } else if (error === 'user_not_found') {
      setStatus('error')
      setMessage('User not found. Please register again.')
    } else if (error === 'server_error') {
      setStatus('error')
      setMessage('Server error. Please try again later.')
    } else {
      setStatus('loading')
      setMessage('Verifying your email...')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LanguageSwitcher />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-card shadow-card p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Email Verification
            </h1>

            {status === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-green-600 mb-6">{message}</p>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 mb-6">{message}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Go to Sign In
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Register Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

