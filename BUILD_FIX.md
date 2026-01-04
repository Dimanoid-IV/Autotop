# Исправление ошибки сборки NextAuth на Vercel

## Проблема

При сборке проекта на Vercel возникает ошибка:
```
Error: Failed to collect page data for /api/auth/[...nextauth]
```

## Решение

Добавлены конфигурации в `app/api/auth/[...nextauth]/route.ts`:

```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

Эти настройки сообщают Next.js, что:
- `dynamic = 'force-dynamic'` - маршрут должен быть динамическим и не пытаться статически генерироваться во время сборки
- `runtime = 'nodejs'` - маршрут должен выполняться в Node.js runtime (явно указывает окружение выполнения)

## Альтернативные решения (если проблема сохраняется)

### Вариант 1: Ленивая инициализация handler

Если проблема все еще возникает, можно попробовать создать handler лениво:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getHandler() {
  return NextAuth(authOptions)
}

export const GET = (req: any, res: any) => getHandler()(req, res)
export const POST = (req: any, res: any) => getHandler()(req, res)
```

### Вариант 2: Проверка переменных окружения

Убедитесь, что все необходимые переменные окружения установлены в Vercel:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `GOOGLE_CLIENT_ID` (опционально)
- `GOOGLE_CLIENT_SECRET` (опционально)

### Вариант 3: Версия Next.js

Убедитесь, что используется совместимая версия Next.js и next-auth:
- Next.js 14.2.x
- next-auth 4.24.x

## Текущий статус

✅ Локальная сборка проходит успешно
⚠️ Ошибка все еще может возникать на Vercel (требует проверки)

