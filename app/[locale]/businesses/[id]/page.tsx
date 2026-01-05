import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { BusinessDetails } from '@/components/BusinessDetails'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses/${id}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      notFound()
    }

    const business = await response.json()

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <LanguageSwitcher />
        <main className="flex-1">
          <BusinessDetails business={business} locale={locale} />
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error fetching business:', error)
    notFound()
  }
}


