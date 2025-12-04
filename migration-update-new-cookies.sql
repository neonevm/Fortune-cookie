-- Migration: Update image_catalog with new fortune cookie images
-- New files: FCookies-BP-1.jpg through FCookies-BP-40.jpg (40 total)
-- Run this in your Supabase SQL Editor

-- Step 1: Deactivate all old fortune cookie images
UPDATE public.image_catalog 
SET is_active = false
WHERE theme = 'fortune' OR id LIKE 'fortune_%';

-- Step 2: Insert all 40 new fortune cookie images
INSERT INTO public.image_catalog (id, url, weight, theme, is_active) VALUES
('cookie_bp_1', '/assets/cookies/FCookies-BP-1.jpg', 1, 'fortune', true),
('cookie_bp_2', '/assets/cookies/FCookies-BP-2.jpg', 1, 'fortune', true),
('cookie_bp_3', '/assets/cookies/FCookies-BP-3.jpg', 1, 'fortune', true),
('cookie_bp_4', '/assets/cookies/FCookies-BP-4.jpg', 1, 'fortune', true),
('cookie_bp_5', '/assets/cookies/FCookies-BP-5.jpg', 1, 'fortune', true),
('cookie_bp_6', '/assets/cookies/FCookies-BP-6.jpg', 1, 'fortune', true),
('cookie_bp_7', '/assets/cookies/FCookies-BP-7.jpg', 1, 'fortune', true),
('cookie_bp_8', '/assets/cookies/FCookies-BP-8.jpg', 1, 'fortune', true),
('cookie_bp_9', '/assets/cookies/FCookies-BP-9.jpg', 1, 'fortune', true),
('cookie_bp_10', '/assets/cookies/FCookies-BP-10.jpg', 1, 'fortune', true),
('cookie_bp_11', '/assets/cookies/FCookies-BP-11.jpg', 1, 'fortune', true),
('cookie_bp_12', '/assets/cookies/FCookies-BP-12.jpg', 1, 'fortune', true),
('cookie_bp_13', '/assets/cookies/FCookies-BP-13.jpg', 1, 'fortune', true),
('cookie_bp_14', '/assets/cookies/FCookies-BP-14.jpg', 1, 'fortune', true),
('cookie_bp_15', '/assets/cookies/FCookies-BP-15.jpg', 1, 'fortune', true),
('cookie_bp_16', '/assets/cookies/FCookies-BP-16.jpg', 1, 'fortune', true),
('cookie_bp_17', '/assets/cookies/FCookies-BP-17.jpg', 1, 'fortune', true),
('cookie_bp_18', '/assets/cookies/FCookies-BP-18.jpg', 1, 'fortune', true),
('cookie_bp_19', '/assets/cookies/FCookies-BP-19.jpg', 1, 'fortune', true),
('cookie_bp_20', '/assets/cookies/FCookies-BP-20.jpg', 1, 'fortune', true),
('cookie_bp_21', '/assets/cookies/FCookies-BP-21.jpg', 1, 'fortune', true),
('cookie_bp_22', '/assets/cookies/FCookies-BP-22.jpg', 1, 'fortune', true),
('cookie_bp_23', '/assets/cookies/FCookies-BP-23.jpg', 1, 'fortune', true),
('cookie_bp_24', '/assets/cookies/FCookies-BP-24.jpg', 1, 'fortune', true),
('cookie_bp_25', '/assets/cookies/FCookies-BP-25.jpg', 1, 'fortune', true),
('cookie_bp_26', '/assets/cookies/FCookies-BP-26.jpg', 1, 'fortune', true),
('cookie_bp_27', '/assets/cookies/FCookies-BP-27.jpg', 1, 'fortune', true),
('cookie_bp_28', '/assets/cookies/FCookies-BP-28.jpg', 1, 'fortune', true),
('cookie_bp_29', '/assets/cookies/FCookies-BP-29.jpg', 1, 'fortune', true),
('cookie_bp_30', '/assets/cookies/FCookies-BP-30.jpg', 1, 'fortune', true),
('cookie_bp_31', '/assets/cookies/FCookies-BP-31.jpg', 1, 'fortune', true),
('cookie_bp_32', '/assets/cookies/FCookies-BP-32.jpg', 1, 'fortune', true),
('cookie_bp_33', '/assets/cookies/FCookies-BP-33.jpg', 1, 'fortune', true),
('cookie_bp_34', '/assets/cookies/FCookies-BP-34.jpg', 1, 'fortune', true),
('cookie_bp_35', '/assets/cookies/FCookies-BP-35.jpg', 1, 'fortune', true),
('cookie_bp_36', '/assets/cookies/FCookies-BP-36.jpg', 1, 'fortune', true),
('cookie_bp_37', '/assets/cookies/FCookies-BP-37.jpg', 1, 'fortune', true),
('cookie_bp_38', '/assets/cookies/FCookies-BP-38.jpg', 1, 'fortune', true),
('cookie_bp_39', '/assets/cookies/FCookies-BP-39.jpg', 1, 'fortune', true),
('cookie_bp_40', '/assets/cookies/FCookies-BP-40.jpg', 1, 'fortune', true)
ON CONFLICT (id) 
DO UPDATE SET
  url = EXCLUDED.url,
  weight = EXCLUDED.weight,
  theme = EXCLUDED.theme,
  is_active = EXCLUDED.is_active;

-- Step 3: Update existing fortunes to use new images
-- This distributes old fortunes across the 40 new cookies based on their creation timestamp
UPDATE public.fortunes
SET 
  image_id = CASE 
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 0 THEN 'cookie_bp_1'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 1 THEN 'cookie_bp_2'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 2 THEN 'cookie_bp_3'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 3 THEN 'cookie_bp_4'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 4 THEN 'cookie_bp_5'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 5 THEN 'cookie_bp_6'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 6 THEN 'cookie_bp_7'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 7 THEN 'cookie_bp_8'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 8 THEN 'cookie_bp_9'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 9 THEN 'cookie_bp_10'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 10 THEN 'cookie_bp_11'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 11 THEN 'cookie_bp_12'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 12 THEN 'cookie_bp_13'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 13 THEN 'cookie_bp_14'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 14 THEN 'cookie_bp_15'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 15 THEN 'cookie_bp_16'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 16 THEN 'cookie_bp_17'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 17 THEN 'cookie_bp_18'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 18 THEN 'cookie_bp_19'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 19 THEN 'cookie_bp_20'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 20 THEN 'cookie_bp_21'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 21 THEN 'cookie_bp_22'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 22 THEN 'cookie_bp_23'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 23 THEN 'cookie_bp_24'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 24 THEN 'cookie_bp_25'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 25 THEN 'cookie_bp_26'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 26 THEN 'cookie_bp_27'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 27 THEN 'cookie_bp_28'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 28 THEN 'cookie_bp_29'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 29 THEN 'cookie_bp_30'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 30 THEN 'cookie_bp_31'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 31 THEN 'cookie_bp_32'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 32 THEN 'cookie_bp_33'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 33 THEN 'cookie_bp_34'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 34 THEN 'cookie_bp_35'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 35 THEN 'cookie_bp_36'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 36 THEN 'cookie_bp_37'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 37 THEN 'cookie_bp_38'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 38 THEN 'cookie_bp_39'
    ELSE 'cookie_bp_40'
  END,
  image_url = CASE 
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 0 THEN '/assets/cookies/FCookies-BP-1.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 1 THEN '/assets/cookies/FCookies-BP-2.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 2 THEN '/assets/cookies/FCookies-BP-3.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 3 THEN '/assets/cookies/FCookies-BP-4.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 4 THEN '/assets/cookies/FCookies-BP-5.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 5 THEN '/assets/cookies/FCookies-BP-6.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 6 THEN '/assets/cookies/FCookies-BP-7.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 7 THEN '/assets/cookies/FCookies-BP-8.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 8 THEN '/assets/cookies/FCookies-BP-9.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 9 THEN '/assets/cookies/FCookies-BP-10.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 10 THEN '/assets/cookies/FCookies-BP-11.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 11 THEN '/assets/cookies/FCookies-BP-12.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 12 THEN '/assets/cookies/FCookies-BP-13.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 13 THEN '/assets/cookies/FCookies-BP-14.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 14 THEN '/assets/cookies/FCookies-BP-15.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 15 THEN '/assets/cookies/FCookies-BP-16.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 16 THEN '/assets/cookies/FCookies-BP-17.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 17 THEN '/assets/cookies/FCookies-BP-18.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 18 THEN '/assets/cookies/FCookies-BP-19.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 19 THEN '/assets/cookies/FCookies-BP-20.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 20 THEN '/assets/cookies/FCookies-BP-21.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 21 THEN '/assets/cookies/FCookies-BP-22.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 22 THEN '/assets/cookies/FCookies-BP-23.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 23 THEN '/assets/cookies/FCookies-BP-24.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 24 THEN '/assets/cookies/FCookies-BP-25.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 25 THEN '/assets/cookies/FCookies-BP-26.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 26 THEN '/assets/cookies/FCookies-BP-27.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 27 THEN '/assets/cookies/FCookies-BP-28.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 28 THEN '/assets/cookies/FCookies-BP-29.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 29 THEN '/assets/cookies/FCookies-BP-30.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 30 THEN '/assets/cookies/FCookies-BP-31.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 31 THEN '/assets/cookies/FCookies-BP-32.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 32 THEN '/assets/cookies/FCookies-BP-33.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 33 THEN '/assets/cookies/FCookies-BP-34.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 34 THEN '/assets/cookies/FCookies-BP-35.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 35 THEN '/assets/cookies/FCookies-BP-36.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 36 THEN '/assets/cookies/FCookies-BP-37.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 37 THEN '/assets/cookies/FCookies-BP-38.jpg'
    WHEN MOD(EXTRACT(EPOCH FROM created_at)::bigint, 40) = 38 THEN '/assets/cookies/FCookies-BP-39.jpg'
    ELSE '/assets/cookies/FCookies-BP-40.jpg'
  END;

-- Step 4: Verify the update
SELECT 'Image Catalog (Active):' as info;
SELECT id, url, weight, theme, is_active 
FROM public.image_catalog 
WHERE is_active = true 
ORDER BY id;

SELECT 'Updated Fortunes Summary:' as info;
SELECT image_id, COUNT(*) as count 
FROM public.fortunes 
GROUP BY image_id
ORDER BY image_id;

SELECT 'Total Active Images:' as info;
SELECT COUNT(*) as total_active_images 
FROM public.image_catalog 
WHERE is_active = true;

