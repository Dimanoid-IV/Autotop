# Чеклист для деплоя на Vercel

## ⚠️ КРИТИЧЕСКИ ВАЖНО

Если сборка на Vercel падает с ошибкой "Failed to collect page data for /api/auth/[...nextauth]", проверьте следующее:

## 1. Переменные окружения (ОБЯЗАТЕЛЬНО!)

### Настройка на Vercel:

1. Зайдите в ваш проект на Vercel: https://vercel.com/dashboard
2. Выберите проект **Autotop**
3. Перейдите в **Settings → Environment Variables**
4. Убедитесь, что установлены следующие переменные для **ВСЕХ окружений** (Production, Preview, Development):

#### Обязательные переменные:

- **`NEXTAUTH_URL`**
  - Production: `https://your-app.vercel.app` (замените на реальный URL)
  - Preview: `https://your-app-git-*.vercel.app`
  - Development: `http://localhost:3000`

- **`NEXTAUTH_SECRET`**
  - Сгенерируйте секретный ключ: 
    ```bash
    openssl rand -base64 32
    ```
  - Или используйте онлайн генератор
  - **ВАЖНО**: Используйте один и тот же ключ для всех окружений

- **`DATABASE_URL`**
  - Строка подключения к PostgreSQL (Neon)
  - Формат: `postgresql://user:password@host/database?sslmode=require`

#### Опциональные переменные:

- **`GOOGLE_CLIENT_ID`** - только если используете Google OAuth
- **`GOOGLE_CLIENT_SECRET`** - только если используете Google OAuth

### Проверка переменных:

После добавления переменных:
1. **Очистите Build Cache**: Settings → General → Clear Build Cache
2. **Создайте новый деплой**: Deployments → Redeploy
3. Проверьте логи сборки на наличие ошибок

## 2. Проверка логов сборки

### Что искать в логах:

1. **Ошибки переменных окружения:**
   - `NEXTAUTH_SECRET is not defined`
   - `DATABASE_URL is not defined`

2. **Ошибки подключения к базе данных:**
   - `Can't reach database server`
   - `Connection timeout`

3. **Ошибки NextAuth:**
   - `Failed to collect page data for /api/auth/[...nextauth]`
   - `NextAuth configuration error`

## 3. Если проблема сохраняется

### Вариант 1: Проверьте версии пакетов

Убедитесь, что в `package.json` используются правильные версии:

```json
{
  "next": "^14.2.0",
  "next-auth": "^4.24.7",
  "@prisma/client": "^5.19.0",
  "prisma": "^5.19.0"
}
```

### Вариант 2: Проверьте Prisma

Убедитесь, что Prisma Client сгенерирован перед деплоем:

```bash
npm run db:generate
```

Это должно быть выполнено автоматически на Vercel, но проверьте логи сборки.

### Вариант 3: Временное отключение NextAuth для тестирования

Если нужно проверить, что проблема именно в NextAuth, можно временно закомментировать NextAuth route и посмотреть, проходит ли сборка.

## 4. Полезные команды для диагностики

### Локально:

```bash
# Проверка переменных окружения
npm run dev

# Проверка сборки
npm run build

# Генерация Prisma Client
npm run db:generate
```

### На Vercel:

- Проверьте логи сборки в разделе Deployments
- Проверьте логи runtime в разделе Functions
- Проверьте переменные окружения в Settings → Environment Variables

## 5. Контакты и поддержка

Если проблема не решается:

1. Проверьте документацию NextAuth: https://next-auth.js.org/
2. Проверьте документацию Vercel: https://vercel.com/docs
3. Создайте issue в репозитории проекта с логами ошибок

## Статус кода

✅ Код настроен правильно  
✅ Локальная сборка проходит успешно  
✅ Используется ленивая инициализация NextAuth  
✅ Prisma импортируется динамически  
⚠️ Требуется проверка переменных окружения на Vercel


