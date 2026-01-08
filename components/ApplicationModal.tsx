'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ApplicationModalProps {
  plan: {
    id: string
    name: string
    price: number
  }
  locale: string
  onClose: () => void
}

export function ApplicationModal({ plan, locale, onClose }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/featured/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planId: plan.id,
          planName: plan.name,
          planPrice: plan.price
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (err) {
      setError(locale === 'ru' 
        ? 'Ошибка отправки. Попробуйте позже.' 
        : 'Viga saatmisel. Proovige hiljem.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === 'ru' ? 'Заявка отправлена!' : 'Taotlus saadetud!'}
            </h3>
            <p className="text-gray-600">
              {locale === 'ru' 
                ? 'Мы свяжемся с вами в ближайшее время' 
                : 'Võtame teiega peagi ühendust'}
            </p>
          </div>
        ) : (
          // Form State
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === 'ru' ? 'Заявка на размещение' : 'Taotlus paigutuseks'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'ru' ? 'Тариф:' : 'Plaan:'} <span className="font-semibold">{plan.name} (€{plan.price})</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ru' ? 'Название автосервиса' : 'Autoteenuse nimi'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={locale === 'ru' ? 'Например: "Autoservis Plus"' : 'Näiteks: "Autoservis Plus"'}
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ru' ? 'Контактное лицо' : 'Kontaktisik'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={locale === 'ru' ? 'Ваше имя' : 'Teie nimi'}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ru' ? 'Телефон' : 'Telefon'} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+372 ..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ru' ? 'Дополнительная информация' : 'Lisainfo'}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={locale === 'ru' ? 'Необязательно' : 'Valikuline'}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {locale === 'ru' ? 'Отмена' : 'Tühista'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? (locale === 'ru' ? 'Отправка...' : 'Saadan...') 
                    : (locale === 'ru' ? 'Отправить' : 'Saada')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
