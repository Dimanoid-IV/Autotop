# Настройка базы данных

## Требования

Проект использует **PostgreSQL** как базу данных.

**Рекомендуемый вариант:** Neon PostgreSQL (бесплатный облачный сервис)

## Вариант 1: Neon PostgreSQL (Рекомендуется) ⭐

### Преимущества:
- ✅ Полностью бесплатный план (достаточно для разработки и небольших проектов)
- ✅ Не требует установки локально
- ✅ Автоматические бэкапы
- ✅ Легко настроить
- ✅ Быстрое подключение

### Шаги настройки:

1. **Регистрация на Neon**
   - Перейдите на https://neon.tech
   - Нажмите "Sign up" (можно через GitHub)
   - Зарегистрируйтесь или войдите

2. **Создание проекта**
   - После входа нажмите "Create Project"
   - Выберите регион (можно выбрать ближайший к Эстонии)
   - Укажите имя проекта (например, "autotop")
   - Нажмите "Create Project"

3. **Получение connection string**
   - После создания проекта вы увидите "Connection String"
   - Выглядит примерно так:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```
   - Скопируйте эту строку

4. **Добавление в .env**
   - Создайте файл `.env` в корне проекта (если его нет)
   - Добавьте строку:
     ```env
     DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
     ```
   - Замените на вашу скопированную строку

5. **Применение схемы**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Заполнение начальных данных**
   ```bash
   npm run db:seed
   ```

Готово! База данных настроена.

---

## Вариант 2: Локальный PostgreSQL

Если вы хотите использовать локальную базу данных:

### Установка PostgreSQL

**Windows:**
1. Скачайте установщик: https://www.postgresql.org/download/windows/
2. Установите PostgreSQL (запомните пароль для пользователя postgres)
3. PostgreSQL будет работать на `localhost:5432`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Создание базы данных

1. Откройте терминал/командную строку
2. Подключитесь к PostgreSQL:
   ```bash
   psql -U postgres
   ```
   (Введите пароль, который вы установили)

3. Создайте базу данных:
   ```sql
   CREATE DATABASE autotop;
   ```
   
4. Выйдите:
   ```sql
   \q
   ```

### Настройка .env

Добавьте в `.env`:
```env
DATABASE_URL="postgresql://postgres:ваш_пароль@localhost:5432/autotop?sslmode=prefer"
```

Замените `ваш_пароль` на пароль пользователя postgres.

### Применение схемы

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

---

## Вариант 3: Другие облачные PostgreSQL

### Supabase (бесплатный)
- Сайт: https://supabase.com
- Регистрация → Create Project
- Settings → Database → Connection String
- Используйте "URI" формат

### Railway (бесплатный пробный период)
- Сайт: https://railway.app
- New Project → Database → PostgreSQL
- Скопируйте DATABASE_URL

### Render (бесплатный)
- Сайт: https://render.com
- New → PostgreSQL
- Скопируйте Internal Database URL

---

## Проверка подключения

После настройки проверьте подключение:

```bash
npm run db:studio
```

Откроется Prisma Studio в браузере - это графический интерфейс для просмотра данных в базе.

---

## Что делает db:seed?

Команда `npm run db:seed` заполняет базу начальными данными:

1. **Города:**
   - Tallinn (Таллинн)
   - Tartu (Тарту)
   - Narva (Нарва)
   - Pärnu (Пярну)

2. **Категории услуг:**
   - Autoteenus (Автосервис)
   - Autoremont (Авторемонт)
   - Autopesu (Автомойка)
   - Detailimine (Детейлинг)
   - Teenindusjaam (Сервисная станция)

3. **Админ-пользователь:**
   - Email: `admin@autotop.ee`
   - Пароль: `admin123`
   - **⚠️ ОБЯЗАТЕЛЬНО СМЕНИТЕ ПАРОЛЬ ПОСЛЕ ПЕРВОГО ВХОДА!**

---

## Решение проблем

### Ошибка: "Can't reach database server"
- Проверьте, что DATABASE_URL правильный
- Для Neon: убедитесь, что используете `?sslmode=require`
- Для локального: проверьте, что PostgreSQL запущен

### Ошибка: "password authentication failed"
- Проверьте пароль в DATABASE_URL
- Для Neon: используйте пароль из панели управления
- Для локального: используйте пароль пользователя postgres

### Ошибка: "database does not exist"
- Для локального: создайте базу данных вручную (см. выше)
- Для Neon: база создается автоматически

### Ошибка при db:push
- Убедитесь, что Prisma Client сгенерирован: `npm run db:generate`
- Проверьте подключение к БД
- Убедитесь, что используете правильный DATABASE_URL

---

## Рекомендация

Для быстрого старта используйте **Neon PostgreSQL**:
- Регистрация займет 2 минуты
- Не нужно ничего устанавливать
- Бесплатно для разработки
- Готово к работе сразу после создания

После настройки базы данных приложение будет полностью функциональным! 🚀



