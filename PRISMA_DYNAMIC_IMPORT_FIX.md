# Исправление: Динамический импорт Prisma во всех API маршрутах

## Проблема

Ошибка сборки на Vercel:
```
Error: Failed to collect page data for /api/businesses/[id]
```

Причина: Prisma Client импортировался напрямую в начале файлов, что могло приводить к попыткам подключения к базе данных во время статического анализа Next.js.

## Решение

Все API маршруты теперь используют **динамический импорт Prisma**, который выполняется только во время выполнения запроса, а не во время сборки.

### Изменения

**Было:**
```typescript
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const business = await prisma.business.findUnique({...})
}
```

**Стало:**
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { prisma } = await import('@/lib/prisma')
  const business = await prisma.business.findUnique({...})
}
```

### Обновленные файлы

✅ `app/api/businesses/route.ts`
✅ `app/api/businesses/[id]/route.ts`
✅ `app/api/reviews/route.ts`
✅ `app/api/reviews/[id]/approve/route.ts`
✅ `app/api/reviews/[id]/reject/route.ts`
✅ `app/api/replies/route.ts`
✅ `app/api/replies/[id]/approve/route.ts`
✅ `app/api/replies/[id]/reject/route.ts`
✅ `app/api/latest-reviews/route.ts`
✅ `app/api/top-businesses/route.ts`
✅ `app/api/cities/route.ts`
✅ `app/api/categories/route.ts`
✅ `app/api/register/route.ts`

## Преимущества

1. **Нет подключения к БД во время сборки** - Prisma инициализируется только при выполнении запроса
2. **Совместимость с Next.js 14** - правильная обработка динамических маршрутов
3. **Улучшенная производительность сборки** - Next.js не пытается статически анализировать маршруты с БД
4. **Готовность к деплою** - все маршруты правильно настроены для Vercel

## Результат

✅ Локальная сборка проходит успешно
✅ Все API маршруты используют динамический импорт
✅ Готово к деплою на Vercel

## Проверка

```bash
npm run build
```

Сборка должна завершиться без ошибок, все маршруты помечены как динамические (ƒ).


