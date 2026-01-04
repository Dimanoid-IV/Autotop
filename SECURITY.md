# Безопасность и защита секретов

## ⚠️ КРИТИЧЕСКИ ВАЖНО

**НИКОГДА не коммитьте реальные секреты в Git!**

## Что НЕ должно быть в репозитории

- ❌ Реальные строки подключения к базе данных (DATABASE_URL с паролями)
- ❌ API ключи и токены
- ❌ Пароли и секретные ключи
- ❌ Приватные ключи SSH
- ❌ Файлы `.env` с реальными значениями

## Что ДОЛЖНО быть в репозитории

- ✅ Файл `.env.example` с примерами (без реальных значений)
- ✅ Документация с инструкциями по настройке
- ✅ Примеры конфигурации с заглушками

## Если вы случайно закоммитили секрет

### Шаг 1: Немедленно измените скомпрометированные секреты

1. **База данных**: Смените пароль в Neon PostgreSQL
   - Зайдите в панель управления Neon
   - Создайте новый пароль для базы данных
   - Обновите `DATABASE_URL` в `.env` файле

2. **API ключи**: Отзовите и создайте новые ключи
   - Context7: создайте новый API ключ
   - GitHub: создайте новый Personal Access Token
   - Google OAuth: создайте новые credentials

3. **NEXTAUTH_SECRET**: Сгенерируйте новый секрет
   ```bash
   openssl rand -base64 32
   ```

### Шаг 2: Удалите секреты из истории Git

**ВНИМАНИЕ**: Это перепишет историю Git. Если репозиторий уже используется другими, это может вызвать проблемы.

```bash
# Используйте git-filter-repo или BFG Repo-Cleaner
# Или создайте новый репозиторий без истории
```

### Шаг 3: Добавьте секреты в .gitignore

Убедитесь, что `.gitignore` содержит:
```
.env
.env*.local
*.pem
```

## Правильная настройка .env файла

### Создайте `.env.example` (можно коммитить):

```env
# Database
DATABASE_URL="postgresql://username:password@host.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@autotop.ee
ADMIN_EMAIL=admin@autotop.ee
```

### Создайте `.env` (НЕ коммитить):

Скопируйте `.env.example` в `.env` и заполните реальными значениями.

## Использование переменных окружения на Vercel

1. Зайдите в настройки проекта на Vercel
2. Перейдите в раздел "Environment Variables"
3. Добавьте все необходимые переменные:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - И другие секреты

**НЕ добавляйте секреты в код!**

## Проверка перед коммитом

Перед каждым коммитом проверьте:

```bash
# Проверьте, что .env не добавлен в коммит
git status

# Проверьте содержимое коммита
git diff --cached

# Ищите потенциальные секреты
git diff --cached | grep -i "password\|secret\|key\|token"
```

## Инструменты для проверки

- **GitGuardian**: Автоматически сканирует репозитории на наличие секретов
- **git-secrets**: Git hook для предотвращения коммита секретов
- **truffleHog**: Сканер секретов в Git истории

## Дополнительные ресурсы

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_cryptographic_key)
- [12 Factor App: Config](https://12factor.net/config)

