'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import { Link, usePathname } from '@/i18n/routing'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const t = useTranslations('common')
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Совместимость: создаем объект session
  const session = user ? { user } : null

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/add-service', label: t('addService') },
    { href: '/advertise', label: t('advertise'), highlight: true },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            AutoTop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md'
                    : pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                {t('signIn')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t">
              {session ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700">
                    {session.user?.name || session.user?.email}
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                  >
                    {t('signOut')}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn')}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}


