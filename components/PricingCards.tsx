'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { ApplicationModal } from './ApplicationModal'

interface PricingCardsProps {
  locale: string
}

export function PricingCards({ locale }: PricingCardsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleApply = (planId: string) => {
    setSelectedPlan(planId)
    setShowModal(true)
  }

  const plans = [
    {
      id: '1month',
      name: locale === 'ru' ? '1 месяц' : '1 kuu',
      price: 29,
      period: locale === 'ru' ? 'месяц' : 'kuu',
      discount: null,
      popular: false,
      features: [
        locale === 'ru' ? 'Размещение в рекламном блоке' : 'Paigutus reklaamiplokis',
        locale === 'ru' ? 'До 5x больше просмотров' : 'Kuni 5x rohkem vaatamisi',
        locale === 'ru' ? 'Появление на главной странице' : 'Ilmumine avalehel',
        locale === 'ru' ? 'Метка "Реклама"' : 'Reklaamimärgis',
      ]
    },
    {
      id: '2months',
      name: locale === 'ru' ? '2 месяца' : '2 kuud',
      price: 49,
      originalPrice: 58,
      period: locale === 'ru' ? '2 месяца' : '2 kuud',
      discount: '15%',
      popular: true,
      features: [
        locale === 'ru' ? 'Все из тарифа "1 месяц"' : 'Kõik plaanist "1 kuu"',
        locale === 'ru' ? 'Экономия 9€' : 'Säästa 9€',
        locale === 'ru' ? 'Приоритет в показе' : 'Prioriteet näitamisel',
      ]
    },
    {
      id: '6months',
      name: locale === 'ru' ? '6 месяцев' : '6 kuud',
      price: 131,
      originalPrice: 174,
      period: locale === 'ru' ? '6 месяцев' : '6 kuud',
      discount: '25%',
      popular: false,
      features: [
        locale === 'ru' ? 'Все из тарифа "2 месяца"' : 'Kõik plaanist "2 kuud"',
        locale === 'ru' ? 'Экономия 43€' : 'Säästa 43€',
        locale === 'ru' ? 'Максимальная видимость' : 'Maksimaalne nähtavus',
      ]
    }
  ]

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
        <div
          key={plan.id}
          className={`
            relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105
            ${plan.popular ? 'ring-2 ring-blue-600' : ''}
          `}
        >
          {/* Popular Badge */}
          {plan.popular && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
              {locale === 'ru' ? 'Популярный' : 'Populaarne'}
            </div>
          )}

          <div className="p-8">
            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                {plan.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    €{plan.originalPrice}
                  </span>
                )}
                <span className="text-5xl font-bold text-gray-900">
                  €{plan.price}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                {locale === 'ru' ? 'за' : 'per'} {plan.period}
              </p>
              
              {/* Discount Badge */}
              {plan.discount && (
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  {locale === 'ru' ? 'Скидка' : 'Allahindlus'} {plan.discount}
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleApply(plan.id)}
              className={`
                block w-full text-center px-6 py-4 rounded-lg font-semibold transition-colors
                ${plan.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
              `}
            >
              {locale === 'ru' ? 'Подать заявку' : 'Esita taotlus'}
            </button>
          </div>
        </div>
      ))}
      </div>

      {/* Application Modal */}
      {showModal && selectedPlan && (
        <ApplicationModal
          plan={plans.find(p => p.id === selectedPlan)!}
          locale={locale}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
