# Contact Form Setup Guide

This guide will help you set up the secure contact form for your portfolio site.

## Important Note

⚠️ **The project will not build successfully until you configure the environment variables with real values.** The placeholder values in `.env.local` will cause build errors. Follow the setup steps below to get proper credentials.

## Prerequisites

- Supabase account
- Resend account
- Vercel account (for deployment and cron jobs)

## Setup Steps

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the SQL migration from `database/migrations/001_create_contact_submissions.sql`
4. Go to Settings → API to get your:
   - Project URL (starts with `https://`)
   - Service role key (starts with `eyJ`)

### 2. Resend Setup

1. Create a Resend account at [resend.com](https://resend.com)
2. Add and verify your domain (or use their sandbox domain for testing)
3. Create an API key in your Resend dashboard
4. Update the "from" email in `src/lib/email.ts` to match your verified domain

### 3. Environment Variables

Update your `.env.local` file with the following values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_email@example.com

# Security
CRON_SECRET=a_random_secret_string_for_cron_security
```

### 4. Update Email Configuration

In `src/lib/emailTemplate.ts`, update the "from" email address:

```typescript
from: 'Portfolio Contact <noreply@yourdomain.com>', // Replace with your domain
```

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in your Vercel project settings
4. Deploy

### 6. Test the Setup

1. Submit a test form on your deployed site
2. Check your Supabase database to confirm the submission was stored
3. Wait for the next day (or manually trigger the cron job) to test email notifications

## Cron Job Configuration

The daily email summary runs at 4:00 PM UTC (8:00 AM PT) daily. To change this:

1. Update the schedule in `vercel.json`
2. Use [crontab.guru](https://crontab.guru/) to help with cron syntax

## Rate Limiting

- Users are limited to 5 submissions per hour per IP
- There's also a 5-minute client-side cooldown after successful submission
- Honeypot field (`company`) automatically rejects bot submissions

## Security Features

- ✅ Server-side validation and sanitization
- ✅ Rate limiting (5 requests/hour per IP)
- ✅ Honeypot field for bot protection
- ✅ Client-side throttling
- ✅ Secure environment variables
- ✅ Input length limits and XSS prevention

## Monitoring

Check your Vercel function logs for any errors with:

- Form submissions: `/api/contact`
- Daily summaries: `/api/cron/daily-summary`

## Free Tier Limits

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Resend**: 3,000 emails/month, 100 emails/day
- **Vercel**: 100GB bandwidth, 1000 GB-hours compute time

These limits should be more than sufficient for a personal portfolio site.

## Troubleshooting

### Forms not submitting

1. Check browser console for errors
2. Verify API endpoints are working: visit `/api/contact` (should return 405 Method Not Allowed)
3. Check Vercel function logs

### Emails not sending

1. Verify RESEND_API_KEY is set correctly
2. Check that your domain is verified in Resend
3. Look at Vercel cron job logs
4. Test the cron endpoint manually with proper authorization

### Database errors

1. Verify Supabase credentials
2. Check that the table was created correctly
3. Ensure RLS policies are set up properly
