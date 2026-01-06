'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch on window focus to ensure session is up to date
    >
      {children}
    </SessionProvider>
  )
}


