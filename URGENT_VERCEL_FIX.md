# СРОЧНО: Исправление ошибок 500 на Vercel

## Проблема
После деплоя все еще видны ошибки 500 на:
- `/api/cities`
- `/api/categories`
- `/api/auth/session`

## Причина
**Скорее всего, переменные окружения НЕ установлены на Vercel!**

## РЕШЕНИЕ (ШАГ ЗА ШАГОМ)

### Шаг 1: Проверьте переменные окружения на Vercel

1. Зайдите в Vercel Dashboard: https://vercel.com
2. Выберите проект `Autotop`
3. Перейдите в **Settings → Environment Variables**

### Шаг 2: Установите ОБЯЗАТЕЛЬНЫЕ переменные

**Добавьте следующие переменные:**

#### 1. DATABASE_URL
- **Ключ:** `DATABASE_URL`
- **Значение:** Строка подключения из Neon Console
- **Формат:** `postgresql://user:password@host/database?sslmode=require`
- **Где взять:** Neon Console → Connection String
- **ВАЖНО:** Выберите окружение **Production** (и Preview, если нужно)

#### 2. NEXTAUTH_URL
- **Ключ:** `NEXTAUTH_URL`
- **Значение:** `https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app`
- **ВАЖНО:** Используйте полный URL вашего приложения на Vercel
- **Где взять:** Vercel Dashboard → Project → Domains (или просто скопируйте URL из браузера)

#### 3. NEXTAUTH_SECRET
- **Ключ:** `NEXTAUTH_SECRET`
- **Значение:** Сгенерированный секретный ключ
- **Как сгенерировать:**
  ```bash
  openssl rand -base64 32
  ```
  Или используйте онлайн генератор: https://generate-secret.vercel.app/32
- **ВАЖНО:** Должен быть установлен для всех окружений

### Шаг 3: Сохраните переменные

1. После добавления каждой переменной нажмите **Save**
2. Убедитесь, что переменные видны в списке
3. Проверьте, что они установлены для **Production** окружения

### Шаг 4: Сделайте Redeploy

**ВАЖНО:** После установки переменных ОБЯЗАТЕЛЬНО сделайте Redeploy!

1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите на три точки (⋯) рядом с деплоем
4. Выберите **Redeploy**
5. **Снимите галочку** "Use existing Build Cache" (если есть)
6. Нажмите **Redeploy**
7. Дождитесь завершения (обычно 1-3 минуты)

### Шаг 5: Проверьте результат

1. Откройте сайт: https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app
2. Откройте консоль браузера (F12)
3. Обновите страницу
4. **Ошибки 500 должны исчезнуть!**

## Если ошибки все еще есть

### Проверьте Function Logs

1. Vercel → Deployments → выберите последний деплой
2. Откройте **Function Logs** (не Build Logs!)
3. Ищите ошибки:
   - `DATABASE_URL is not set` → переменная не установлена
   - `NEXTAUTH_SECRET is not set` → переменная не установлена
   - `Prisma Client is not available` → проблема с DATABASE_URL
   - `Can't reach database server` → проблема с подключением к БД

### Проверьте API напрямую

Откройте в браузере:
```
https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app/api/cities
https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app/api/categories
```

**Ожидаемый результат:**
- `[]` (пустой массив) - если БД пустая или недоступна
- `[{...}, {...}]` (массив с данными) - если все работает

**Если видите:**
- `500 Internal Server Error` → переменные окружения не установлены
- `{"error": "..."}` → проверьте Function Logs

## Чеклист

- [ ] DATABASE_URL установлен в Vercel
- [ ] NEXTAUTH_URL установлен в Vercel (полный URL)
- [ ] NEXTAUTH_SECRET установлен в Vercel
- [ ] Все переменные установлены для **Production** окружения
- [ ] Сделан Redeploy после установки переменных
- [ ] Проверены Function Logs на наличие ошибок
- [ ] Проверены API напрямую в браузере

## КРИТИЧЕСКИ ВАЖНО

**Без переменных окружения приложение НЕ БУДЕТ РАБОТАТЬ!**

Все исправления в коде уже сделаны, но они не помогут, если переменные окружения не установлены на Vercel.

## Контакты

Если после всех шагов проблема сохраняется:
1. Скопируйте Function Logs с Vercel
2. Скопируйте ошибки из консоли браузера
3. Проверьте, что все переменные установлены правильно


