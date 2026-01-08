/**
 * Получает базовый URL приложения
 * Используется для SEO мета-тегов, canonical URLs, и т.д.
 */
export function getBaseUrl(): string {
  // В production на Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Явно указанный URL (для production)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  // Fallback для development
  return 'https://autotop.vercel.app'
}
