# Как получить DATABASE_URL для Neon PostgreSQL

## Шаг 1: Войдите в Neon Console

1. Откройте https://console.neon.tech
2. Войдите в свой аккаунт (или создайте новый, если его нет)

## Шаг 2: Найдите ваш проект

1. В списке проектов найдите проект **autotop-estonia** (или создайте новый)
2. Нажмите на название проекта

## Шаг 3: Где найти Connection String

В Neon Console строка подключения может находиться в разных местах в зависимости от версии интерфейса:

### Вариант 1: Dashboard проекта

1. После открытия проекта вы увидите **Dashboard**
2. Найдите карточку или раздел с названием:
   - **"Connection string"**
   - **"Connect"**
   - **"Connection Details"**
   - **"Connection URI"**
   - **"Database"**
3. Нажмите на этот раздел
4. Скопируйте строку подключения

### Вариант 2: Боковое меню

1. В левом боковом меню найдите:
   - **"Connection Details"**
   - **"Settings"** → **"Connection"**
   - **"Database"** → **"Connection"**
   - **"Connect"**
2. Откройте этот раздел
3. Найдите строку подключения и скопируйте её

### Вариант 3: Кнопка "Connect" или "Copy"

1. На главной странице проекта найдите большую кнопку:
   - **"Connect"**
   - **"Copy connection string"**
   - **"Get connection string"**
2. Нажмите на неё
3. Выберите формат: **"Connection string"** или **"URI"**
4. Скопируйте строку

### Вариант 4: Через SQL Editor

1. В боковом меню найдите **"SQL Editor"** или **"Query"**
2. Откройте его
3. В верхней части может быть кнопка **"Connection string"** или **"Copy connection"**
4. Нажмите на неё и скопируйте

### Вариант 5: Settings → Connection

1. В боковом меню найдите **"Settings"**
2. Откройте **"Settings"**
3. Найдите вкладку или раздел:
   - **"Connection"**
   - **"Database"**
   - **"Connection Details"**
4. Там будет строка подключения

## Шаг 4: Формат строки подключения

Строка будет выглядеть примерно так:

```
postgresql://neondb_owner:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

Или с дополнительными параметрами:

```
postgresql://neondb_owner:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

## Если ничего не помогает

### Способ 1: Создайте новый проект

1. В Neon Console нажмите **"Create Project"** или **"New Project"**
2. Заполните:
   - **Project Name**: `autotop-estonia`
   - **Region**: выберите регион (например, `us-east-2`)
   - **PostgreSQL Version**: выберите последнюю версию
3. После создания проекта строка подключения обычно отображается сразу на главной странице

### Способ 2: Используйте API

Если у вас есть доступ к Neon API, можно получить connection string через API, но это сложнее.

### Способ 3: Проверьте документацию Neon

1. Зайдите на https://neon.tech/docs
2. Найдите раздел **"Connect"** или **"Connection"**
3. Там будут актуальные инструкции

## Шаг 5: Используйте на Vercel

1. Зайдите в настройки проекта на Vercel: https://vercel.com/dashboard
2. Выберите проект **Autotop**
3. Перейдите в **Settings → Environment Variables**
4. Добавьте переменную:
   - **Key**: `DATABASE_URL`
   - **Value**: вставьте скопированную строку подключения
   - Выберите окружения: Production, Preview, Development
5. Сохраните

## Важные моменты

- ✅ Используйте **pooler connection string** для продакшена (содержит `-pooler` в хосте)
- ✅ Всегда используйте `sslmode=require` для безопасности
- ❌ Не коммитьте строку подключения в Git
- ❌ Не делитесь строкой подключения публично

## Альтернатива: Если не можете найти connection string

Если вы не можете найти connection string в интерфейсе, но у вас есть доступ к проекту:

1. Попробуйте создать новый branch в проекте
2. Или создайте новый проект в Neon
3. При создании нового проекта connection string обычно показывается сразу

## Скриншоты (примерное расположение)

Connection string обычно находится:
- На главной странице проекта (Dashboard)
- В разделе Settings → Connection
- В боковом меню как отдельный пункт "Connection Details"
- В виде кнопки "Connect" на главной странице

## Дополнительная помощь

Если вы все еще не можете найти connection string:
1. Проверьте документацию Neon: https://neon.tech/docs/connect/connect-from-any-app
2. Создайте новый проект - при создании connection string показывается автоматически
3. Обратитесь в поддержку Neon через их сайт
