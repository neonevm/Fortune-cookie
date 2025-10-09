-- Migration script to update fortune URLs to new domain
-- Run this after deploying to production with the new domain

-- Check current URLs before migration
SELECT 'Before migration:' as status, share_url, count(*) as count
FROM public.fortunes
GROUP BY share_url;

-- Replace old Vercel domain with new custom domain
UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'https://fortune-cookie-umber.vercel.app', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%fortune-cookie-umber.vercel.app%';

-- Replace any remaining localhost URLs with new domain
UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'http://localhost:3002', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%localhost:3002%';

UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'http://localhost:3003', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%localhost:3003%';

-- Replace any other localhost variations
UPDATE public.fortunes 
SET share_url = REPLACE(share_url, 'http://localhost:3000', 'https://cookie.neonevm.org')
WHERE share_url LIKE '%localhost%';

-- Verify the update
SELECT 'After migration:' as status, share_url, count(*) as count
FROM public.fortunes
GROUP BY share_url;

-- Show recent records to verify
SELECT id, slug, handle, share_url, created_at 
FROM public.fortunes 
ORDER BY created_at DESC 
LIMIT 10;
