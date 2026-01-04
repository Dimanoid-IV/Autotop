# Быстрое исправление: сайт не открывается

## Проблема

Сервер запущен, но сайт не открывается, потому что отсутствует файл `.env` с настройками базы данных.

## Решение

### Шаг 1: Создайте файл .env

Создайте файл `.env` в корне проекта `C:\cursorproject\Autotop\.env` со следующим содержимым:

```env
DATABASE_URL="postgresql://neondb_owner:npg_JHuo5yihlK0X@ep-tiny-base-ae1jc3sm-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-me-in-production-12345
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@autotop.ee
ADMIN_EMAIL=admin@autotop.ee
```

**Важно:** Скопируйте весь блок выше, включая кавычки для DATABASE_URL!

### Шаг 2: Перезапустите сервер

```bash
npm run dev
```

### Шаг 3: Откройте в браузере

- http://localhost:3000/et (Estonian)
- http://localhost:3000/ru (Russian)

## Альтернатива: Запуск с переменной окружения

Если не можете создать .env файл, запустите так:

**PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_JHuo5yihlK0X@ep-tiny-base-ae1jc3sm-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
$env:NEXTAUTH_URL="http://localhost:3000"
$env:NEXTAUTH_SECRET="dev-secret-key"
npm run dev
```

**Command Prompt (cmd):**
```cmd
set DATABASE_URL=postgresql://neondb_owner:npg_JHuo5yihlK0X@ep-tiny-base-ae1jc3sm-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
set NEXTAUTH_URL=http://localhost:3000
set NEXTAUTH_SECRET=dev-secret-key
npm run dev
```

## Проверка

После запуска откройте браузер и перейдите на:
- http://localhost:3000

Если страница загружается - все работает! ✅


