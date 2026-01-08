# 🚀 Инструкция по настройке "Топ размещение"

## ✅ Что было создано:

1. **Страница для владельцев:** `/advertise` - 3 тарифных плана
2. **Компонент FeaturedBusinesses** - рекламный блок на главной (6 мест)
3. **Stripe webhook** - автоматическая активация после оплаты
4. **Обновленная БД схема** - поля для featured бизнесов

---

## 📋 Что нужно сделать:

### 1️⃣ Обновите базу данных:

```bash
npx prisma migrate dev --name add_featured_businesses
```

Это добавит поля в таблицу `Business`:
- `isFeatured` - активно ли размещение
- `featuredUntil` - дата окончания
- `featuredPlan` - выбранный тариф
- `featuredOrder` - порядок показа

---

### 2️⃣ Создайте Payment Links в Stripe:

1. Откройте [Stripe Dashboard](https://dashboard.stripe.com/test/payment-links)

2. **Создайте 3 Payment Link:**

#### Тариф "1 месяц" (15€):
- Product: "Featured Placement - 1 Month"
- Price: 15 EUR
- Type: One-time payment
- Metadata:
  - `plan`: `1month`
  - `businessId`: `{CHECKOUT_SESSION_ID}` (заполнится автоматически)

#### Тариф "2 месяца" (28€):
- Product: "Featured Placement - 2 Months"
- Price: 28 EUR
- Type: One-time payment
- Metadata:
  - `plan`: `2months`
  - `businessId`: `{CHECKOUT_SESSION_ID}`

#### Тариф "6 месяцев" (75€):
- Product: "Featured Placement - 6 Months"
- Price: 75 EUR
- Type: One-time payment
- Metadata:
  - `plan`: `6months`
  - `businessId`: `{CHECKOUT_SESSION_ID}`

3. **Скопируйте ссылки** и добавьте в `.env`:

```env
NEXT_PUBLIC_STRIPE_LINK_1MONTH=https://buy.stripe.com/test_...
NEXT_PUBLIC_STRIPE_LINK_2MONTHS=https://buy.stripe.com/test_...
NEXT_PUBLIC_STRIPE_LINK_6MONTHS=https://buy.stripe.com/test_...
```

---

### 3️⃣ Настройте Stripe Webhook:

1. Откройте [Webhooks](https://dashboard.stripe.com/test/webhooks)

2. **Add endpoint:**
   - URL: `https://autotop.vercel.app/api/webhooks/stripe`
   - Events: 
     - `checkout.session.completed`
     - `customer.subscription.deleted`

3. **Скопируйте Webhook Secret** и добавьте в `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Убедитесь что есть:**

```env
STRIPE_SECRET_KEY=sk_test_...
```

---

### 4️⃣ Деплой на Vercel:

```bash
git add .
git commit -m "Add featured placement system with Stripe integration"
git push origin main
```

Vercel автоматически задеплоит изменения.

---

## 🎯 Как это работает:

### Для владельцев бизнеса:

1. Заходят на `/advertise`
2. Выбирают тариф (1, 2 или 6 месяцев)
3. Оплачивают через Stripe
4. **Автоматически** через 5 минут их бизнес попадает в топ

### На главной странице:

- **Рекламный блок** с 6 автосервисами
- **Синяя рамка** + метка "TOP"
- **Случайный порядок** (каждый раз разный)
- **Дисклеймер** "Реклама" внизу

### Webhook обработка:

1. Пользователь оплачивает → Stripe отправляет webhook
2. Наш сервер получает событие `checkout.session.completed`
3. Автоматически обновляем БД:
   - `isFeatured = true`
   - `featuredUntil = +30/60/180 дней`
   - `featuredPlan = "1month"/"2months"/"6months"`
4. Бизнес появляется в топе!

---

## 📊 Ценообразование:

- **1 месяц:** 15€
- **2 месяца:** 28€ (скидка 7%)
- **6 месяцев:** 75€ (скидка 17%)

---

## 🔧 Дополнительные настройки:

### Изменить количество мест в топе:

В `components/FeaturedBusinesses.tsx` измените:

```typescript
take: 6, // Измените на нужное количество
```

### Изменить порядок показа:

Сейчас используется случайный порядок (`featuredOrder`).
Можно изменить на:
- По дате оплаты
- По рейтингу
- По алфавиту

---

## ✅ Готово!

После выполнения всех шагов система будет работать полностью автоматически! 🎉

**Страницы:**
- `/advertise` - для владельцев
- `/` - главная с рекламным блоком

**API:**
- `/api/webhooks/stripe` - обработка платежей
