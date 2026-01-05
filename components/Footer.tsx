'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">AutoTop</h3>
            <p className="text-gray-400 text-sm">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('common')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/add-service" className="text-gray-400 hover:text-white">
                  {t('addService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contacts')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@autotop.ee</li>
              <li>Phone: +372 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} AutoTop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


