# Quick Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data (cities, categories, admin user)
   npm run db:seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open http://localhost:3000
   - Default admin: admin@autotop.ee / admin123

## Important Notes

### Leaflet CSS
If you see map styling issues, ensure Leaflet CSS is imported. The Map component already handles this, but if issues persist, you may need to add to `app/globals.css`:

```css
@import 'leaflet/dist/leaflet.css';
```

### Email Configuration
For development, you can use:
- Gmail with App Password
- Mailtrap for testing
- SendGrid for production

### Google OAuth
1. Create OAuth credentials in Google Cloud Console
2. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Update `.env` with credentials

## Testing the Application

1. **Create a Business**
   - Navigate to "Add Service"
   - Fill in business details
   - Submit

2. **Leave a Review**
   - Sign in or register
   - Go to business page
   - Click "Write Review"
   - Submit review (will be pending)

3. **Moderate Review**
   - Check admin email
   - Click "Approve" link
   - Review appears on business page

4. **Business Owner Reply**
   - Claim business as owner
   - Reply to review
   - Reply requires moderation

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check SSL mode if using Neon
- Ensure database is accessible

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Verify Google OAuth credentials

### Email Not Sending
- Check SMTP credentials
- Verify `ADMIN_EMAIL` is set
- Test SMTP connection separately

### i18n Issues
- Ensure locale is in URL: `/et/` or `/ru/`
- Check translation files exist
- Verify middleware is working

## Next Steps

1. Customize design colors/branding
2. Add more cities/categories
3. Configure production environment
4. Set up monitoring/analytics
5. Add more features as needed


