# Domain Change Guide

## Quick Domain Update

To change the domain in the future, you only need to update **one file**:

### 1. Update `src/lib/config.ts`

Change the `productionDomain` value:

```typescript
export const config = {
  // Update this line with your new domain
  productionDomain: 'https://your-new-domain.com',
  
  // ... rest of the config stays the same
}
```

### 2. Update Environment Variables (if needed)

If you're using environment variables, update:

```bash
NEXT_PUBLIC_APP_URL=https://your-new-domain.com
```

### 3. Update Database Records (if needed)

If you have existing fortune records with old URLs, run the migration:

```sql
-- Update existing records to use new domain
UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'https://fortune-cookie-umber.vercel.app', 'https://your-new-domain.com')
WHERE share_url LIKE '%fortune-cookie-umber.vercel.app%';
```

## What Gets Updated Automatically

When you change the domain in `config.ts`, these will automatically use the new domain:

- ✅ **New Fortune URLs**: All new fortunes will use the new domain
- ✅ **Twitter/X Previews**: Meta tags will use the new domain for image URLs
- ✅ **Share Links**: All new share links will use the new domain
- ✅ **Open Graph Tags**: Social media previews will use the new domain

## Current Configuration

- **Production Domain**: `https://cookie.neonevm.org`
- **Development Domain**: `http://localhost:3003`
- **Auto-detection**: Uses production domain when `NODE_ENV=production`

## Testing

After changing the domain:

1. Deploy the changes
2. Generate a new fortune
3. Test the share functionality
4. Verify Twitter/X preview shows the correct domain
5. Check that images load properly from the new domain
