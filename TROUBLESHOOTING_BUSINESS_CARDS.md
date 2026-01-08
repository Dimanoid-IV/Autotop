# Диагностика: Карточки бизнесов не отображаются

## Шаг 1: Проверьте консоль браузера

1. Откройте сайт на Vercel
2. Нажмите F12 (или правый клик → Inspect)
3. Перейдите на вкладку **Console**
4. Ищите ошибки, особенно:
   - `Failed to fetch businesses`
   - `API Error: 500`
   - `DATABASE_URL is not set`
   - `Network request failed`

**Что делать:**
- Скопируйте все ошибки из консоли
- Проверьте, есть ли запросы к `/api/businesses` в Network tab

## Шаг 2: Проверьте переменные окружения на Vercel

1. Зайдите в Vercel → Settings → Environment Variables
2. Убедитесь, что установлены:
   - ✅ `DATABASE_URL` - строка подключения из Neon
   - ✅ `NEXTAUTH_URL` - URL вашего приложения
   - ✅ `NEXTAUTH_SECRET` - секретный ключ

3. **ВАЖНО:** Убедитесь, что переменные установлены для **Production** окружения

## Шаг 3: Проверьте логи Vercel

1. Зайдите в Vercel → Deployments
2. Выберите последний деплой
3. Откройте **Function Logs** (не Build Logs!)
4. Ищите ошибки:
   - `DATABASE_URL is not set`
   - `Can't reach database server`
   - `Prisma Client initialization error`

## Шаг 4: Проверьте, есть ли данные в базе

### Вариант А: Через Prisma Studio (локально)

1. Убедитесь, что `.env` файл настроен локально
2. Запустите:
   ```bash
   npm run db:studio
   ```
3. Проверьте таблицу `Business` - есть ли там записи?

### Вариант Б: Через Neon Console

1. Зайдите в Neon Console
2. Откройте SQL Editor
3. Выполните запрос:
   ```sql
   SELECT COUNT(*) FROM "Business";
   ```
4. Если результат = 0, значит база пустая!

## Шаг 5: Если база пустая - загрузите данные

Если в базе нет данных, нужно их загрузить:

1. **Локально:**
   ```bash
   npm run db:import
   ```
   (если у вас есть CSV файл с данными)

2. **Или вручную через Neon Console:**
   - Зайдите в SQL Editor
   - Создайте тестовую запись:
   ```sql
   INSERT INTO "Business" (id, name, address, "cityId", "categoryId", verified, "createdAt", "updatedAt")
   VALUES (
     gen_random_uuid(),
     'Test Business',
     'Test Address',
     (SELECT id FROM "City" LIMIT 1),
     (SELECT id FROM "Category" LIMIT 1),
     true,
     NOW(),
     NOW()
   );
   ```

## Шаг 6: Проверьте API напрямую

Откройте в браузере:
```
https://your-app.vercel.app/api/businesses
```

**Ожидаемый результат:**
```json
{
  "businesses": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": X,
    "totalPages": Y
  }
}
```

**Если видите ошибку:**
- `{"error": "Database connection not configured"}` → DATABASE_URL не установлен
- `{"error": "Internal server error"}` → Проверьте Function Logs на Vercel
- Пустой массив `{"businesses": []}` → База данных пустая

## Шаг 7: Проверьте Network tab

1. Откройте DevTools → Network tab
2. Обновите страницу
3. Найдите запрос к `/api/businesses`
4. Проверьте:
   - **Status:** должен быть 200 (OK)
   - **Response:** должен содержать JSON с данными

## Частые проблемы и решения

### Проблема 1: "DATABASE_URL is not set"
**Решение:**
1. Зайдите в Vercel → Settings → Environment Variables
2. Добавьте `DATABASE_URL` с правильным значением
3. Убедитесь, что выбрано окружение **Production**
4. Сделайте Redeploy

### Проблема 2: База данных пустая
**Решение:**
- Загрузите данные через `db:import` локально
- Или создайте тестовые записи через Neon Console

### Проблема 3: CORS ошибки
**Решение:**
- Проверьте, что запросы идут на правильный домен
- Убедитесь, что `NEXTAUTH_URL` установлен правильно

### Проблема 4: Prisma Client не сгенерирован
**Решение:**
- Проверьте, что в `package.json` есть `postinstall` скрипт
- Проверьте Build Logs на Vercel - должна быть строка `prisma generate`

## Что делать дальше

1. **Проверьте консоль браузера** - там будут конкретные ошибки
2. **Проверьте Function Logs на Vercel** - там будут ошибки сервера
3. **Проверьте переменные окружения** - особенно DATABASE_URL
4. **Проверьте наличие данных в базе**

После проверки всех пунктов, сообщите:
- Что показывает консоль браузера?
- Что показывают Function Logs на Vercel?
- Есть ли данные в базе?




