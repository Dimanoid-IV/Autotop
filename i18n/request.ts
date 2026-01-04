import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  let messages
  switch (locale) {
    case 'ru':
      messages = (await import('../messages/ru.json')).default
      break
    case 'et':
    default:
      messages = (await import('../messages/et.json')).default
      break
  }

  return {
    locale,
    messages,
  }
})

