# Инструкция по импорту данных из CSV

## Шаг 1: Создать базу данных на Neon

✅ База данных уже создана!

**Детали проекта:**
- Project ID: `hidden-bird-78979965`
- Database: `neondb`
- Connection String: Указан ниже

## Шаг 2: Настроить .env файл

Создайте файл `.env` в корне проекта и добавьте:

```env
DATABASE_URL="postgresql://neondb_owner:npg_JHuo5yihlK0X@ep-tiny-base-ae1jc3sm-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-me
```

## Шаг 3: Применить схему базы данных

```bash
npm run db:generate
npm run db:push
```

## Шаг 4: Заполнить начальные данные (города, категории)

```bash
npm run db:seed
```

Это создаст:
- Города (Tallinn, Tartu, Narva, Pärnu)
- Категории услуг
- Админ-пользователя

## Шаг 5: Импортировать данные из CSV

```bash
npm run db:import
```

Скрипт:
- Прочитает файл `C:\cursorproject\parser_servisi\estonia_businesses_for_google_sheets.csv`
- Распарсит CSV данные
- Определит город по адресу
- Определит категорию по названию
- Загрузит все бизнесы в базу данных

## Формат CSV

CSV файл должен содержать следующие колонки:
- Название (Name)
- Адрес (Address)
- Телефон (Phone) - опционально
- Веб-сайт (Website) - опционально
- Координаты (Coordinates) - формат: "latitude,longitude" - опционально

## Примечания

- Скрипт автоматически определяет город по адресу
- Скрипт определяет категорию по названию (remont/repair = авторемонт, pesu/wash = автомойка, detail = детейлинг)
- Дубликаты пропускаются (проверка по названию и адресу)
- Координаты парсятся автоматически, если указаны

## Результат

После импорта все бизнесы будут доступны в приложении AutoTop!


