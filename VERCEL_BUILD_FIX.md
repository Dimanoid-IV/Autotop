# Исправление ошибки сборки NextAuth на Vercel

## Проблема

Ошибка: `Error: Failed to collect page data for /api/auth/[...nextauth]`

## Решение

Файл `app/api/auth/[...nextauth]/route.ts` настроен следующим образом:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## Критические требования для Vercel

### 1. Переменные окружения (ОБЯЗАТЕЛЬНО!)

Убедитесь, что в настройках проекта Vercel установлены:

- ✅ `NEXTAUTH_URL` - URL вашего приложения на Vercel (например, `https://your-app.vercel.app`)
- ✅ `NEXTAUTH_SECRET` - Секретный ключ (можно сгенерировать: `openssl rand -base64 32`)
- ✅ `DATABASE_URL` - Строка подключения к PostgreSQL (Neon)
- ⚠️ `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET` (опционально, если используете Google OAuth)

### 2. Проверка настроек Vercel

1. Зайдите в настройки проекта на Vercel
2. Перейдите в **Settings → Environment Variables**
3. Убедитесь, что все переменные установлены для всех окружений (Production, Preview, Development)
4. После добавления переменных, перезапустите деплой

### 3. Если проблема сохраняется

#### Вариант 1: Проверьте версии пакетов

Убедитесь, что используются совместимые версии:
```json
{
  "next": "^14.2.0",
  "next-auth": "^4.24.7"
}
```

#### Вариант 2: Очистите кеш Vercel

1. Зайдите в настройки проекта
2. Найдите опцию "Clear Build Cache"
3. Очистите кеш и перезапустите сборку

#### Вариант 3: Проверьте логи сборки

В логах сборки Vercel ищите:
- Ошибки подключения к базе данных
- Отсутствующие переменные окружения
- Ошибки инициализации Prisma

## Альтернативное решение (если ничего не помогает)

Если стандартный подход не работает, можно временно отключить статическую оптимизацию для всего приложения в `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    // Временно отключить статическую оптимизацию
    isrMemoryCacheSize: 0,
  },
}
```

**Внимание:** Это может повлиять на производительность, используйте только как временное решение.

## Статус

✅ Код настроен правильно  
✅ Локальная сборка проходит успешно  
⚠️ Требуется проверка переменных окружения на Vercel


