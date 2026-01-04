# Настройка .env файла

## ⚠️ ВАЖНО: Файл .env отсутствует!

Сервер не может подключиться к базе данных, потому что отсутствует файл `.env`.

## Решение

### Шаг 1: Создайте файл `.env`

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

1. Остановите текущий сервер (Ctrl+C в терминале)
2. Запустите снова:
   ```bash
   npm run dev
   ```

### Шаг 3: Проверьте

Откройте в браузере:
- http://localhost:3000/et
- http://localhost:3000/ru

Карточки фирм должны быть видны! 🎉

## Почему это важно?

Без файла `.env` с `DATABASE_URL`:
- ❌ Prisma не может подключиться к базе данных
- ❌ API возвращает пустые результаты
- ❌ Карточки фирм не отображаются

После создания `.env`:
- ✅ Prisma подключится к Neon PostgreSQL
- ✅ API будет возвращать данные (49 фирм в базе)
- ✅ Карточки фирм будут отображаться


