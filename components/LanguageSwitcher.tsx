'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as string

  const switchLanguage = (locale: string) => {
    router.replace(pathname, { locale })
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage('et')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentLocale === 'et'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ET
      </button>
      <button
        onClick={() => switchLanguage('ru')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentLocale === 'ru'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        RU
      </button>
    </div>
  )
}


