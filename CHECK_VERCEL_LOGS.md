# Как проверить логи на Vercel и найти причину ошибок 500

## Шаг 1: Откройте Function Logs на Vercel

1. Зайдите в Vercel Dashboard: https://vercel.com
2. Выберите проект `Autotop`
3. Перейдите в **Deployments**
4. Найдите последний деплой (должен быть с зеленой галочкой "Ready")
5. Нажмите на деплой, чтобы открыть детали
6. Перейдите на вкладку **Function Logs** (НЕ Build Logs!)

## Шаг 2: Что искать в логах

### Если видите эти ошибки:

#### 1. `DATABASE_URL is not set`
**Проблема:** Переменная окружения `DATABASE_URL` не установлена
**Решение:** 
- Settings → Environment Variables → Добавьте `DATABASE_URL`
- Значение: строка подключения из Neon Console
- Выберите окружение **Production**
- Сделайте Redeploy

#### 2. `NEXTAUTH_SECRET is not set`
**Проблема:** Переменная окружения `NEXTAUTH_SECRET` не установлена
**Решение:**
- Settings → Environment Variables → Добавьте `NEXTAUTH_SECRET`
- Значение: сгенерированный ключ (см. GENERATE_SECRET.md)
- Выберите окружение **Production**
- Сделайте Redeploy

#### 3. `Prisma Client is not available`
**Проблема:** Prisma не может подключиться к базе данных
**Возможные причины:**
- `DATABASE_URL` не установлен
- `DATABASE_URL` неправильный (неверный формат)
- База данных недоступна из Vercel
**Решение:**
- Проверьте `DATABASE_URL` в Neon Console
- Убедитесь, что строка подключения правильная
- Проверьте, что база данных активна в Neon

#### 4. `Can't reach database server`
**Проблема:** Vercel не может подключиться к Neon
**Решение:**
- Проверьте, что база данных активна в Neon Console
- Убедитесь, что `DATABASE_URL` правильный
- Попробуйте создать новую строку подключения в Neon

#### 5. `Failed to initialize Prisma Client`
**Проблема:** Ошибка при инициализации Prisma
**Решение:**
- Проверьте `DATABASE_URL`
- Убедитесь, что Prisma Client сгенерирован (должно быть в Build Logs: `prisma generate`)

## Шаг 3: Проверьте переменные окружения

1. Vercel → Settings → Environment Variables
2. Убедитесь, что видны:
   - ✅ `DATABASE_URL` (для Production)
   - ✅ `NEXTAUTH_URL` (для Production)
   - ✅ `NEXTAUTH_SECRET` (для Production)

3. Если переменных нет - добавьте их (см. URGENT_VERCEL_FIX.md)

## Шаг 4: Проверьте Build Logs

1. Deployments → последний деплой → **Build Logs**
2. Ищите:
   - `prisma generate` - должно быть выполнено
   - `Compiled successfully` - сборка должна пройти успешно
   - Ошибки сборки - если есть, исправьте их

## Шаг 5: Проверьте API напрямую

Откройте в браузере (без авторизации):

```
https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app/api/cities
https://autotop-jb6gh7ghd-dimanoid-ivs-projects.vercel.app/api/categories
```

**Что должно быть:**
- `[]` (пустой массив) - если БД пустая, но API работает
- `[{...}, {...}]` (массив с данными) - если все работает

**Если видите:**
- `500 Internal Server Error` → проверьте Function Logs
- `{"error": "..."}` → скопируйте ошибку и проверьте логи

## Шаг 6: Если ничего не помогает

### Вариант 1: Пересоздайте переменные окружения

1. Settings → Environment Variables
2. Удалите все переменные
3. Добавьте их заново:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Сделайте Redeploy

### Вариант 2: Создайте новый проект

1. Создайте новый проект на Vercel
2. Подключите тот же репозиторий `Dimanoid-IV/Autotop`
3. Установите все переменные окружения
4. Задеплойте

## Что делать прямо сейчас

1. ✅ Откройте Function Logs на Vercel
2. ✅ Скопируйте все ошибки, которые видите
3. ✅ Проверьте переменные окружения
4. ✅ Если переменных нет - установите их
5. ✅ Сделайте Redeploy
6. ✅ Проверьте результат

## Контакты

Если после всех шагов проблема сохраняется:
- Скопируйте Function Logs
- Скопируйте ошибки из консоли браузера
- Проверьте, что все переменные установлены правильно


