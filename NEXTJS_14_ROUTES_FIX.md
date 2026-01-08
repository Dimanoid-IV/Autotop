# Исправление динамических маршрутов для Next.js 14

## Проблема

При сборке проекта на Vercel возникали ошибки:
- `Error: Failed to collect page data for /api/businesses/[id]`
- `Dynamic server usage: Route /api/latest-reviews couldn't be rendered statically because it used nextUrl.searchParams`
- `Dynamic server usage: Route /api/top-businesses couldn't be rendered statically because it used nextUrl.searchParams`

## Решение

### 1. Асинхронные параметры маршрута

В Next.js 14 App Router параметры динамических маршрутов (`params`) теперь должны быть асинхронными (Promise).

**Было:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
  })
}
```

**Стало:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const business = await prisma.business.findUnique({
    where: { id },
  })
}
```

### 2. Force Dynamic для маршрутов с searchParams

Маршруты, использующие `request.nextUrl.searchParams`, должны явно указывать динамический рендеринг.

**Добавлено:**
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

### 3. Исправленные файлы

- ✅ `app/api/businesses/[id]/route.ts` - async params
- ✅ `app/api/reviews/[id]/approve/route.ts` - async params + dynamic imports
- ✅ `app/api/reviews/[id]/reject/route.ts` - async params + dynamic imports
- ✅ `app/api/replies/[id]/approve/route.ts` - async params + dynamic imports
- ✅ `app/api/replies/[id]/reject/route.ts` - async params + dynamic imports
- ✅ `app/api/latest-reviews/route.ts` - force-dynamic
- ✅ `app/api/top-businesses/route.ts` - force-dynamic

## Результат

✅ Локальная сборка проходит успешно
✅ Все динамические маршруты правильно настроены
✅ Готово к деплою на Vercel

## Проверка

```bash
npm run build
```

Сборка должна завершиться без ошибок.




