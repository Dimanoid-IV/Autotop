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
    // Используем абсолютный URL для серверного компонента
    const baseUrl = process.env.NEXTAUTH_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const response = await fetch(
      `${baseUrl}/api/businesses/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`Business not found: ${id}, status: ${response.status}`)
      notFound()
    }

    const business = await response.json()
    
    if (!business || !business.id) {
      console.error(`Invalid business data for id: ${id}`)
      notFound()
    }

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


