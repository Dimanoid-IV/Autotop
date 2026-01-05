# Как получить DATABASE_URL для Neon PostgreSQL

## Шаг 1: Войдите в Neon Console

1. Откройте https://console.neon.tech
2. Войдите в свой аккаунт (или создайте новый, если его нет)

## Шаг 2: Найдите ваш проект

1. В списке проектов найдите проект **autotop-estonia** (или создайте новый)
2. Нажмите на название проекта

## Шаг 3: Получите Connection String

1. В панели проекта найдите раздел **Connection Details** или **Connection String**
2. Вы увидите строку подключения в формате:
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

### Альтернативный способ:

1. В боковом меню найдите **Connection Details** или **Settings**
2. Найдите раздел **Connection String** или **Connection URI**
3. Нажмите кнопку **Copy** или **Show** для отображения строки

## Шаг 4: Скопируйте строку подключения

Строка будет выглядеть примерно так:
```
postgresql://neondb_owner:your_password@ep-tiny-base-ae1jc3sm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Важно**: 
- Строка содержит пароль - храните её в безопасности
- Не коммитьте её в Git
- Используйте только в `.env` файле и на Vercel

## Шаг 5: Используйте на Vercel

1. Зайдите в настройки проекта на Vercel: https://vercel.com/dashboard
2. Выберите проект **Autotop**
3. Перейдите в **Settings → Environment Variables**
4. Добавьте переменную:
   - **Key**: `DATABASE_URL`
   - **Value**: вставьте скопированную строку подключения
   - Выберите окружения: Production, Preview, Development
5. Сохраните

## Если у вас нет проекта в Neon

### Создание нового проекта:

1. Зайдите на https://console.neon.tech
2. Нажмите **Create Project**
3. Заполните:
   - **Project Name**: `autotop-estonia` (или любое другое имя)
   - **Region**: выберите ближайший регион (например, `us-east-2`)
   - **PostgreSQL Version**: выберите последнюю версию (обычно 15 или 16)
4. Нажмите **Create Project**
5. После создания проекта, скопируйте Connection String из раздела **Connection Details**

## Если забыли пароль

Если вы не помните пароль от базы данных:

1. В Neon Console перейдите в настройки проекта
2. Найдите раздел **Database** или **Connection**
3. Вы можете:
   - Сбросить пароль (если доступно)
   - Создать новый branch с новым паролем
   - Создать новый проект

## Проверка подключения

После добавления `DATABASE_URL` на Vercel:

1. Перезапустите деплой
2. Проверьте логи сборки - не должно быть ошибок подключения к базе данных
3. Проверьте логи runtime - приложение должно успешно подключаться к базе

## Формат строки подключения

Стандартный формат для Neon:
```
postgresql://username:password@host.neon.tech/database?sslmode=require
```

Или с дополнительными параметрами:
```
postgresql://username:password@host.neon.tech/database?channel_binding=require&sslmode=require
```

## Важно

- ✅ Используйте **pooler connection string** для продакшена (содержит `-pooler` в хосте)
- ✅ Используйте **direct connection string** только для локальной разработки
- ✅ Всегда используйте `sslmode=require` для безопасности
- ❌ Не коммитьте строку подключения в Git
- ❌ Не делитесь строкой подключения публично

## Дополнительная информация

- Документация Neon: https://neon.tech/docs
- Руководство по подключению: https://neon.tech/docs/connect/connect-from-any-app

