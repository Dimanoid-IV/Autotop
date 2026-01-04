# Информация о базе данных Neon

## Детали проекта

**Project ID:** `hidden-bird-78979965`  
**Project Name:** autotop-estonia  
**Database:** neondb  
**Branch:** main (br-icy-brook-ae8uq7tc)

## Connection String

Добавьте в файл `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_JHuo5yihlK0X@ep-tiny-base-ae1jc3sm-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

## Статус

✅ База данных создана  
✅ Схема применена (Prisma schema)  
✅ Начальные данные загружены:
  - 4 города (Tallinn, Tartu, Narva, Pärnu)
  - 5 категорий услуг
  - Админ-пользователь (admin@autotop.ee / admin123)

✅ Данные из CSV импортированы:
  - **51 бизнес** успешно импортирован из файла
  - Данные включают: название, адрес, телефон, сайт, координаты
  - Автоматически определены города и категории

## Доступ к базе данных

Вы можете:
1. Использовать Prisma Studio: `npm run db:studio`
2. Подключиться через любой PostgreSQL клиент
3. Использовать Neon Console: https://console.neon.tech

## Важно

⚠️ **Смените пароль админа** после первого входа:
- Email: `admin@autotop.ee`
- Пароль: `admin123`

## Следующие шаги

1. Добавьте `DATABASE_URL` в `.env` файл
2. Запустите приложение: `npm run dev`
3. Проверьте данные в базе: `npm run db:studio`
4. Откройте http://localhost:3000

Приложение готово к использованию! 🚀


