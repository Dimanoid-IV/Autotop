import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PricingCards } from '@/components/PricingCards'
import { Check, TrendingUp, Star, Users } from 'lucide-react'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'advertise' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default function AdvertisePage({ params }: { params: { locale: string } }) {
  const isRussian = params.locale === 'ru'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {isRussian
                ? 'Разместите свой автосервис в ТОП' 
                : 'Paigutage oma autoteenus TOP-i'}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {isRussian
                ? 'Получайте больше клиентов с премиум размещением на главной странице'
                : 'Saage rohkem kliente premium paigutusega avalehel'}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {isRussian ? 'Больше видимости' : 'Rohkem nähtavust'}
              </h3>
              <p className="text-sm text-gray-600">
                {isRussian
                  ? 'Ваш сервис в рекламном блоке на главной' 
                  : 'Teie teenus reklaamiplokis avalehel'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {isRussian ? 'Премиум метка' : 'Premium märgis'}
              </h3>
              <p className="text-sm text-gray-600">
                {isRussian
                  ? 'Значок "TOP" выделяет ваш сервис' 
                  : 'TOP märgis eristab teie teenust'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {isRussian ? 'Больше клиентов' : 'Rohkem kliente'}
              </h3>
              <p className="text-sm text-gray-600">
                {isRussian
                  ? 'До 5x больше просмотров профиля' 
                  : 'Kuni 5x rohkem profiili vaatamisi'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {isRussian ? 'Просто и быстро' : 'Lihtne ja kiire'}
              </h3>
              <p className="text-sm text-gray-600">
                {isRussian
                  ? 'Активация через 5 минут после оплаты' 
                  : 'Aktiveerimine 5 minuti pärast makset'}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-4">
            {isRussian ? 'Выберите тариф' : 'Valige plaan'}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {isRussian
              ? 'Оплата не гарантирует первое место. Ваш автосервис будет появляться в рекламном блоке на главной странице в произвольном порядке.'
              : 'Makse ei garanteeri esimest kohta. Teie autoteenus ilmub avalehe reklaamiplokis juhuslikus järjekorras.'}
          </p>
          <PricingCards locale={params.locale} />
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl my-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isRussian ? 'Как это работает' : 'Kuidas see töötab'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2 text-lg">
                {isRussian ? 'Выберите тариф' : 'Valige plaan'}
              </h3>
              <p className="text-gray-600">
                {isRussian
                  ? 'Оплатите через Stripe безопасным способом' 
                  : 'Makske läbi Stripe turvalise meetodi'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2 text-lg">
                {isRussian ? 'Автоматическая активация' : 'Automaatne aktiveerimine'}
              </h3>
              <p className="text-gray-600">
                {isRussian
                  ? 'Размещение активируется автоматически через 5 минут' 
                  : 'Paigutus aktiveeritakse automaatselt 5 minuti pärast'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2 text-lg">
                {isRussian ? 'Получайте клиентов' : 'Saage kliente'}
              </h3>
              <p className="text-gray-600">
                {isRussian
                  ? 'Ваш сервис в топе на главной странице!' 
                  : 'Teie teenus top-is avalehel!'}
              </p>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              {isRussian ? 'Важные условия:' : 'Olulised tingimused:'}
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {isRussian
                    ? 'Оплата обеспечивает размещение в рекламном блоке, но не гарантирует первое место'
                    : 'Makse tagab paigutuse reklaamiplokis, kuid ei garanteeri esimest kohta'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {isRussian
                    ? 'Ваш автосервис будет появляться в произвольном порядке среди других рекламных мест'
                    : 'Teie autoteenus ilmub juhuslikus järjekorras teiste reklaamkohtade hulgas'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {isRussian
                    ? 'Максимум 6 автосервисов одновременно в рекламном блоке'
                    : 'Maksimaalselt 6 autoteenust korraga reklaamiplokis'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {isRussian
                    ? 'Размещение активируется автоматически после успешной оплаты'
                    : 'Paigutus aktiveeritakse automaatselt pärast edukat makset'}
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
