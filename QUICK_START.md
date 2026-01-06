# Быстрый запуск локально

## Шаг 1: Создайте файл .env

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# Database - используйте Neon PostgreSQL (бесплатный: https://neon.tech)
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-me-$(openssl rand -base64 32)

# Google OAuth (опционально, можно настроить позже)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email для модерации (опционально для первого запуска)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@autotop.ee
ADMIN_EMAIL=admin@autotop.ee
```

**Минимальная конфигурация для первого запуска:**
- `DATABASE_URL` - обязательно
- `NEXTAUTH_URL` - обязательно
- `NEXTAUTH_SECRET` - обязательно (можно сгенерировать случайную строку)
- Остальное можно оставить пустым для первого запуска

## Шаг 2: Настройте базу данных

### Вариант A: Neon PostgreSQL (рекомендуется - бесплатный)

1. Зайдите на https://neon.tech
2. Создайте аккаунт (бесплатно)
3. Создайте новый проект
4. Скопируйте connection string
5. Вставьте в `.env` как `DATABASE_URL`

### Вариант B: Локальный PostgreSQL

Установите PostgreSQL локально и создайте базу данных.

## Шаг 3: Примените схему базы данных

```bash
# Сгенерировать Prisma Client
npm run db:generate

# Применить схему к базе данных
npm run db:push

# Заполнить начальные данные (города, категории, админ)
npm run db:seed
```

После seed будет создан админ:
- Email: `admin@autotop.ee`
- Пароль: `admin123`

## Шаг 4: Запустите сервер

```bash
npm run dev
```

Откройте http://localhost:3000 в браузере.

## Если возникли ошибки

### Ошибка подключения к БД
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что база данных доступна
- Для Neon проверьте SSL режим

### Ошибка NEXTAUTH_SECRET
- Убедитесь, что `NEXTAUTH_SECRET` задан в `.env`
- Можно использовать любую случайную строку для разработки

### Ошибки компиляции TypeScript
- Убедитесь, что все зависимости установлены: `npm install`
- Проверьте версии Node.js (нужна 18+)

## Быстрый тест

1. Откройте http://localhost:3000
2. Переключите язык (RU/ET)
3. Попробуйте зарегистрироваться
4. Добавьте бизнес
5. Оставьте отзыв

## Примечания

- Для работы модерации отзывов нужно настроить SMTP (email)
- Для Google OAuth нужно настроить Google Cloud Console
- Без email/Google OAuth можно использовать только email/пароль регистрацию



