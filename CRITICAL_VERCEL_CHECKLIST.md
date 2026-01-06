# КРИТИЧЕСКИЙ ЧЕКЛИСТ ДЛЯ VERCEL

## Проблема: Все еще 500 ошибки на API

Если после всех исправлений все еще видите 500 ошибки, проверьте:

## 1. ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (ОБЯЗАТЕЛЬНО!)

Зайдите в Vercel → Settings → Environment Variables

### Должны быть установлены:

✅ **DATABASE_URL**
- Формат: `postgresql://user:password@host/database?sslmode=require`
- Получите из Neon Console → Connection String
- **ВАЖНО:** Убедитесь, что выбрано окружение **Production** (и Preview, если нужно)

✅ **NEXTAUTH_URL**
- Формат: `https://your-app.vercel.app`
- **ВАЖНО:** Используйте полный URL вашего приложения на Vercel
- Пример: `https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app`

✅ **NEXTAUTH_SECRET**
- Сгенерируйте: `openssl rand -base64 32`
- Или используйте любой случайный длинный строковый ключ
- **ВАЖНО:** Должен быть установлен для всех окружений

### Опционально (для Google OAuth):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 2. ПРОВЕРКА ПОСЛЕ УСТАНОВКИ ПЕРЕМЕННЫХ

1. **Сохраните переменные** в Vercel
2. **Сделайте Redeploy:**
   - Deployments → последний деплой → три точки (⋯) → Redeploy
   - Или сделайте новый commit и push

## 3. ПРОВЕРКА ЛОГОВ

После деплоя проверьте:

### Function Logs (не Build Logs!)
1. Vercel → Deployments → выберите деплой
2. Откройте **Function Logs**
3. Ищите ошибки:
   - `DATABASE_URL is not set` → переменная не установлена
   - `NEXTAUTH_SECRET is not set` → переменная не установлена
   - `Can't reach database server` → проблема с подключением к БД
   - `Prisma Client is not available` → проблема с Prisma

## 4. ПРОВЕРКА API НАПРЯМУЮ

Откройте в браузере:

```
https://your-app.vercel.app/api/cities
https://your-app.vercel.app/api/categories
https://your-app.vercel.app/api/businesses
```

**Ожидаемый результат:**
- `[]` (пустой массив) - если БД пустая или недоступна
- `[{...}, {...}]` (массив с данными) - если все работает

**Если видите ошибку:**
- `{"error": "..."}` → проверьте Function Logs
- `500 Internal Server Error` → проверьте переменные окружения

## 5. ЕСЛИ ВСЕ ЕЩЕ НЕ РАБОТАЕТ

### Вариант 1: Создайте новый проект на Vercel
1. Создайте новый проект
2. Подключите тот же GitHub репозиторий
3. Установите все переменные окружения
4. Задеплойте

### Вариант 2: Проверьте версию Node.js
В Vercel → Settings → General проверьте:
- Node.js Version: должен быть 18.x или 20.x

### Вариант 3: Проверьте базу данных
1. Зайдите в Neon Console
2. SQL Editor → выполните: `SELECT COUNT(*) FROM "Business";`
3. Если 0 - база пустая, нужно загрузить данные

## 6. ЧТО ДОЛЖНО РАБОТАТЬ ПОСЛЕ ИСПРАВЛЕНИЙ

✅ API `/api/cities` - возвращает `[]` или данные (не 500)
✅ API `/api/categories` - возвращает `[]` или данные (не 500)
✅ API `/api/businesses` - возвращает данные или пустой массив
✅ NextAuth `/api/auth/session` - возвращает JSON (не пустой ответ)
✅ Нет 500 ошибок в консоли браузера

## 7. ЕСЛИ КАРТОЧКИ НЕ ОТОБРАЖАЮТСЯ

1. Проверьте `/api/businesses` напрямую - есть ли данные?
2. Проверьте консоль браузера - есть ли ошибки?
3. Проверьте базу данных - есть ли записи в таблице `Business`?

## КОНТАКТЫ

Если после всех проверок проблема сохраняется:
1. Скопируйте Function Logs с Vercel
2. Скопируйте ошибки из консоли браузера
3. Проверьте, что все переменные окружения установлены правильно


