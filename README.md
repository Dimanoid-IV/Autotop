# AutoTop - Multilingual Auto Service Rating Platform (Estonia)

A production-ready web platform for discovering and rating auto services in Estonia, supporting both Russian and Estonian languages.

## Features

- 🌍 **Multilingual Support**: Russian (RU) and Estonian (ET)
- ⭐ **5-Star Rating System**: Users can rate and review auto services
- 🔍 **Advanced Search**: Search by city, service type, or name
- 📧 **Email Moderation**: All reviews require admin approval via email
- 👥 **User Roles**: Guest, Registered User, Admin, Business Owner
- 🗺️ **Interactive Maps**: Location-based service discovery
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile
- 🔐 **Authentication**: Email/password and Google OAuth

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js
- **i18n**: next-intl
- **Maps**: Leaflet (OpenStreetMap)
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google OAuth credentials (for Google sign-in)
- SMTP credentials (for email moderation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Autotop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `SMTP_*`: Your email service credentials
- `ADMIN_EMAIL`: Email address for review moderation notifications

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed initial data (optional):
```bash
# You can create a seed script to populate cities and categories
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Autotop/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Homepage
│   │   ├── businesses/    # Business pages
│   │   ├── auth/          # Authentication pages
│   │   └── admin/         # Admin panel
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema
├── messages/              # Translation files
└── i18n/                  # i18n configuration
```

## Key Features Implementation

### Review Moderation

1. User submits a review → Status: `PENDING`
2. Email sent to admin with approve/reject links
3. Admin clicks link → Review status updated
4. Approved reviews appear on business page

### Business Owner Verification

- Business owners can claim their business
- Verified businesses show a checkmark badge
- Owners can reply to reviews (also requires moderation)

### Search & Filtering

- Sticky search bar on scroll
- Filter by city and service category
- Real-time search results

## Database Schema

- **Users**: Authentication and user profiles
- **Businesses**: Auto service listings
- **Reviews**: User reviews and ratings
- **ReviewReplies**: Business owner responses
- **Cities**: City data (multilingual)
- **Categories**: Service categories (multilingual)

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel, Railway, or your preferred platform

3. Set environment variables in your hosting platform

4. Run database migrations:
```bash
npx prisma migrate deploy
```

## Contributing

This is a production-ready application. When making changes:

1. Follow TypeScript best practices
2. Maintain i18n support for all user-facing text
3. Test review moderation flow
4. Ensure responsive design works on all devices

## License

Proprietary - All rights reserved


