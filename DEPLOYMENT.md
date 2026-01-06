# Deployment Guide

## Prerequisites

1. **Database Setup (Neon)**
   - Create a Neon PostgreSQL database
   - Copy the connection string
   - Add to `.env` as `DATABASE_URL`

2. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
   - Add credentials to `.env`:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`

3. **Email Setup (SMTP)**
   - Use Gmail, SendGrid, or any SMTP service
   - For Gmail, create an App Password
   - Add to `.env`:
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASSWORD`
     - `SMTP_FROM`
     - `ADMIN_EMAIL` (email for review moderation notifications)

4. **NextAuth Secret**
   - Generate: `openssl rand -base64 32`
   - Add to `.env` as `NEXTAUTH_SECRET`

5. **NextAuth URL**
   - Production: `https://yourdomain.com`
   - Development: `http://localhost:3000`
   - Add to `.env` as `NEXTAUTH_URL`

## Deployment Steps

### 1. Database Migration

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations
npm run db:migrate
```

### 2. Seed Initial Data

```bash
npm run db:seed
```

This creates:
- Cities (Tallinn, Tartu, Narva, Pärnu)
- Categories (Auto Service, Auto Repair, Car Wash, Detailing, Service Station)
- Admin user (email: admin@autotop.ee, password: admin123)

**Important**: Change the admin password after first login!

### 3. Build Application

```bash
npm run build
```

### 4. Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### 5. Deploy to Other Platforms

#### Railway
1. Create new project
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

#### Self-hosted
1. Set up Node.js server
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run: `npm start`
5. Use PM2 or similar for process management

## Environment Variables Checklist

- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your application URL
- [ ] `NEXTAUTH_SECRET` - Random secret key
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `SMTP_HOST` - SMTP server hostname
- [ ] `SMTP_PORT` - SMTP server port (usually 587)
- [ ] `SMTP_USER` - SMTP username
- [ ] `SMTP_PASSWORD` - SMTP password
- [ ] `SMTP_FROM` - From email address
- [ ] `ADMIN_EMAIL` - Admin email for notifications

## Post-Deployment

1. **Change Admin Password**
   - Log in as admin@autotop.ee
   - Change password immediately

2. **Test Review Moderation**
   - Create a test review
   - Check admin email for moderation link
   - Test approve/reject functionality

3. **Verify Email Notifications**
   - Ensure SMTP credentials are correct
   - Test email delivery

4. **Set Up Custom Domain** (if needed)
   - Configure DNS
   - Update `NEXTAUTH_URL`
   - Update Google OAuth redirect URI

## Monitoring

- Monitor database connections
- Check email delivery rates
- Monitor API response times
- Set up error tracking (Sentry, etc.)

## Security Checklist

- [ ] All environment variables are set
- [ ] Admin password changed
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Rate limiting configured (if needed)
- [ ] CORS properly configured



