'use client'

import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Link } from '@/i18n/routing'
import { CheckCircle } from 'lucide-react'

interface OwnerVerificationCTAProps {
  business: any
  session: any
  locale: string
}

export function OwnerVerificationCTA({
  business,
  session,
  locale,
}: OwnerVerificationCTAProps) {
  const t = useTranslations('business')

  // Don't show if already verified or if user is not the owner
  if (business.verified) {
    return null
  }

  const isOwner = session?.user?.id === business.ownerId

  return (
    <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mt-6">
      <div className="flex items-start gap-4">
        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('ownerCTA')}
          </h3>
          <p className="text-gray-700 mb-4">{t('ownerCTADesc')}</p>
          {isOwner ? (
            <Link
              href={`/businesses/${business.id}/verify`}
              className="inline-block px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors"
            >
              Verify Business
            </Link>
          ) : (
            <Link
              href={`/businesses/${business.id}/claim`}
              className="inline-block px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors"
            >
              Claim Business
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

