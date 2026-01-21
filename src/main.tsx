import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#00c5cc',
          colorText: '#334155',
          fontFamily: 'Manrope, sans-serif',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-soft border border-border-light',
          navbar: 'hidden',
          headerTitle: 'font-extrabold text-2xl',
          socialButtonsBlockButton: 'border-border-light hover:bg-slate-50 transition-all',
          formButtonPrimary: 'bg-primary hover:opacity-90 transition-all shadow-none',
          footerActionLink: 'text-primary hover:text-primary/80 font-bold',
        }
      }}
    >
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
