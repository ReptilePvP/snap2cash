# Supabase Setup Guide for Snap2Cash

This guide will walk you through setting up Supabase for the Snap2Cash application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: `snap2cash` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **Project API Keys** > **anon public** key

## 3. Configure Environment Variables

### For the Web Frontend

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### For the Mobile App

Update the `app.json` file in the `mobile` directory:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-ref.supabase.co",
      "supabaseAnonKey": "your-anon-key-here",
      "geminiApiKey": "your_gemini_api_key",
      "apiUrl": "http://localhost:8080"
    }
  }
}
```

## 4. Set Up the Database Schema

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/create_users_table.sql`
5. Click **Run** to execute the migration

### Option B: Using Supabase CLI (Recommended for developers)

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

## 5. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure the following settings:

### Site URL
- Set to `http://localhost:5173` for development
- Update to your production URL when deploying

### Auth Providers
- **Email**: Enable email authentication (should be enabled by default)
- **Email Confirmations**: You can disable this for development, but enable for production

### Email Templates (Optional)
- Customize the email templates for signup confirmation, password reset, etc.

## 6. Set Up Row Level Security (RLS)

The migration script automatically sets up RLS policies, but here's what it does:

1. **Enables RLS** on the `profiles` table
2. **Creates policies** that allow:
   - Users to read their own profile
   - Users to update their own profile
   - Users to insert their own profile (during signup)

## 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Try creating a new account
4. Check your Supabase dashboard:
   - Go to **Authentication** > **Users** to see the new user
   - Go to **Table Editor** > **profiles** to see the profile record

## 8. Production Deployment

When deploying to production:

1. Update your environment variables with production Supabase credentials
2. Update the **Site URL** in Supabase Auth settings to your production domain
3. Enable email confirmations for security
4. Consider setting up custom SMTP for email delivery

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Double-check your environment variables
2. **CORS errors**: Make sure your Site URL is correctly set in Supabase
3. **Profile not created**: Check that the database trigger is working by looking at the SQL logs
4. **RLS errors**: Verify that the RLS policies are correctly set up

### Useful Supabase Dashboard Sections

- **Authentication** > **Users**: View all registered users
- **Table Editor**: View and edit your database tables
- **SQL Editor**: Run custom SQL queries
- **Logs**: View real-time logs for debugging
- **API Docs**: Auto-generated API documentation

## Security Best Practices

1. **Never commit your `.env` files** to version control
2. **Use different Supabase projects** for development and production
3. **Enable email confirmation** in production
4. **Regularly rotate your API keys**
5. **Monitor your usage** in the Supabase dashboard

## Next Steps

Once Supabase is set up, you can:

1. Extend the user profile with additional fields
2. Add tables for storing analysis history
3. Implement user preferences and settings
4. Set up real-time subscriptions for live updates

For more advanced features, check out the [Supabase documentation](https://supabase.com/docs).