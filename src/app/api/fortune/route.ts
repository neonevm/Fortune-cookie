export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getRandomImage, createFortune, logEvent } from '@/lib/supabase'
import { getAppUrl } from '@/lib/config'

// Validate and normalize Twitter handle
function validateHandle(handle: string): string | null {
  // Remove leading @ if present
  const normalized = handle.replace(/^@/, '').toLowerCase()
  
  // Check if it matches Twitter handle regex: ^[A-Za-z0-9_]{1,15}$
  const handleRegex = /^[A-Za-z0-9_]{1,15}$/
  
  if (!handleRegex.test(normalized)) {
    return null
  }
  
  return normalized
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { handle } = body

    // Validate handle
    if (!handle || typeof handle !== 'string') {
      return NextResponse.json(
        { error: 'Handle is required' },
        { status: 400 }
      )
    }

    const normalizedHandle = validateHandle(handle)
    if (!normalizedHandle) {
      return NextResponse.json(
        { error: 'Invalid handle format' },
        { status: 400 }
      )
    }

    // Get random image
    const image = await getRandomImage()
    if (!image) {
      return NextResponse.json(
        { error: 'No images available' },
        { status: 500 }
      )
    }

    // Generate unique slug
    const slug = nanoid(6)
    const shareUrl = `${getAppUrl()}/f/${slug}`

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create fortune record
    await createFortune({
      slug,
      handle: normalizedHandle,
      image_id: image.id,
      image_url: image.url,
      ip_hash: ip, // In production, hash this for privacy
      user_agent: userAgent,
      share_url: shareUrl,
    })

    // Log the generation event
    await logEvent({
      type: 'generate',
      fortune_slug: slug,
      handle: normalizedHandle,
    })

    return NextResponse.json({
      slug,
      shareUrl,
      image: {
        id: image.id,
        url: image.url,
      },
    })

  } catch (error) {
    console.error('Error generating fortune:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
