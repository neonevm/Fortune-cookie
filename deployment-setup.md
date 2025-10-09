# Production Deployment Setup

## Environment Variables Required

For production deployment, you need to set these environment variables:

### Required Environment Variables:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Example for Vercel:
```bash
NEXT_PUBLIC_APP_URL=https://cookie.neonevm.org
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Migration for Production URLs

After deployment, you'll need to update existing fortune records to use the production domain:

```sql
-- Update all existing fortune records to use production domain
UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'http://localhost:3002', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%localhost%';

UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'http://localhost:3003', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%localhost%';
```

## How Twitter/X Preview Works

1. **Open Graph Meta Tags**: The page generates proper Open Graph meta tags with the fortune cookie image
2. **Twitter Cards**: Uses `summary_large_image` card type for rich previews
3. **Image URL**: Constructed using the production domain from `NEXT_PUBLIC_APP_URL`
4. **Share URL**: Uses the production domain for the fortune link

## Testing the Preview

1. Deploy with production environment variables
2. Generate a new fortune
3. Share the link on X/Twitter
4. The preview should show:
   - Title: "Your Mean Crypto Fortune"
   - Description: "@username pulled a savage cookie. Want yours?"
   - Large image: The fortune cookie image
   - Link: The fortune share URL

## Troubleshooting

If the preview doesn't work:
1. Check that `NEXT_PUBLIC_APP_URL` is set correctly
2. Verify the image URLs are accessible from the production domain
3. Use Twitter's Card Validator: https://cards-dev.twitter.com/validator
4. Check that the fortune cookie images are properly served from the production domain
