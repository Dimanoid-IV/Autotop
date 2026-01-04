# Устранение проблем с MCP серверами

## Проблемы с context7 и github MCP серверами

### Проверка конфигурации

Текущая конфигурация в `C:\Users\37258\.cursor\mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ваш_ключ_здесь"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ваш_токен_здесь"
      }
    }
  }
}
```

## Возможные проблемы и решения

### 1. Проблема: Неверный или истекший API ключ

**Решение для context7:**
- Проверьте API ключ на https://console.upstash.com/
- Убедитесь, что ключ активен и имеет правильные права
- Если нужно, создайте новый ключ

**Решение для github:**
- Проверьте токен на https://github.com/settings/tokens
- Убедитесь, что токен не истек
- Убедитесь, что токен имеет необходимые права доступа (repo, read:org и т.д.)
- Если нужно, создайте новый токен

### 2. Проблема: Не установлен Node.js или npx

**Решение:**
```bash
# Проверьте версию Node.js
node --version

# Проверьте npx
npx --version
```

Если не установлено, установите Node.js с https://nodejs.org/

### 3. Проблема: Сетевые ограничения или прокси

**Решение:**
- Проверьте интернет-соединение
- Если используете прокси, настройте переменные окружения:
  - `HTTP_PROXY`
  - `HTTPS_PROXY`
  - `NO_PROXY`

### 4. Проблема: Кеш npx

**Решение:**
Очистите кеш npx:
```bash
npx clear-npx-cache
```

Или вручную удалите кеш:
- Windows: `%LOCALAPPDATA%\npm-cache\_npx`

### 5. Проблема: Конфигурация в Cursor

**Решение:**
1. Убедитесь, что файл `mcp.json` имеет правильный JSON синтаксис
2. Перезапустите Cursor IDE
3. Проверьте логи в Developer Console: `Help → Toggle Developer Tools`

### 6. Проблема: Версия пакетов

**Решение:**
Попробуйте указать конкретную версию:
```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"],
    "env": {
      "CONTEXT7_API_KEY": "ваш_ключ"
    }
  },
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github@latest"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ваш_токен"
    }
  }
}
```

## Диагностика

### Проверка работы серверов вручную

**context7:**
```bash
$env:CONTEXT7_API_KEY="ваш_ключ_здесь"
npx -y @upstash/context7-mcp
```

**github:**
```bash
$env:GITHUB_PERSONAL_ACCESS_TOKEN="ваш_токен_здесь"
npx -y @modelcontextprotocol/server-github
```

### Проверка логов в Cursor

1. Откройте Developer Console: `Help → Toggle Developer Tools`
2. Перейдите на вкладку "Console"
3. Ищите ошибки, связанные с MCP серверами
4. Проверьте вкладку "Network" на предмет сетевых ошибок

## Альтернативные варианты конфигурации

### Вариант 1: Использование глобальной установки

Если npx не работает, попробуйте установить пакеты глобально:

```bash
npm install -g @upstash/context7-mcp
npm install -g @modelcontextprotocol/server-github
```

Затем в `mcp.json`:
```json
{
  "context7": {
    "command": "context7-mcp",
    "env": {
      "CONTEXT7_API_KEY": "ваш_ключ"
    }
  },
  "github": {
    "command": "server-github",
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ваш_токен"
    }
  }
}
```

### Вариант 2: Использование node напрямую

```json
{
  "context7": {
    "command": "node",
    "args": ["-e", "require('@upstash/context7-mcp')"],
    "env": {
      "CONTEXT7_API_KEY": "ваш_ключ"
    }
  }
}
```

## Полезные ссылки

- Context7 MCP: https://github.com/upstash/context7-mcp
- GitHub MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/github
- Cursor MCP документация: https://docs.cursor.com/mcp

## Если ничего не помогает

1. Переустановите Cursor IDE
2. Проверьте, что все переменные окружения установлены правильно
3. Попробуйте использовать другие MCP серверы для тестирования
4. Обратитесь в поддержку Cursor с логами ошибок


