export const runtime = 'edge'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFortuneBySlug, logEvent } from '@/lib/supabase'
import { getAppUrl, social, app } from '@/lib/config'
import SharePageClient from './SharePageClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fortune = await getFortuneBySlug(slug)

  if (!fortune) {
    return {
      title: 'Fortune Not Found',
    }
  }

  const handle = fortune.handle
  // Use centralized configuration for domain
  const base = getAppUrl()
  // Normalize spaces to hyphens to avoid 404s on some hosts/CDNs
  const normalizedPath = fortune.image_url.replace(/\s/g, '-')
  const imageUrl = normalizedPath.startsWith('http')
    ? normalizedPath
    : new URL(normalizedPath, base).toString()

  return {
    title: `@${handle}'s ${app.name}`,
    description: `@${handle} got fortune slapped by ${social.twitter.site}. Want your own savage crypto fortune?`,
    openGraph: {
      title: `@${handle}'s ${app.name}`,
      description: `@${handle} got fortune slapped by ${social.twitter.site}. Want your own savage crypto fortune?`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: `Fortune cookie for @${handle}`,
        },
      ],
      type: 'website',
      url: `${base}/f/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      site: social.twitter.site,
      creator: social.twitter.creator,
      title: `@${handle}'s ${app.name}`,
      description: `@${handle} got fortune slapped by ${social.twitter.site}. Want your own savage crypto fortune?`,
      images: [imageUrl],
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { slug } = await params
  const fortune = await getFortuneBySlug(slug)

  if (!fortune) {
    notFound()
  }

  // Log the view event
  await logEvent({
    type: 'view',
    fortune_slug: slug,
    handle: fortune.handle,
  })

  return <SharePageClient fortune={fortune} />
}
