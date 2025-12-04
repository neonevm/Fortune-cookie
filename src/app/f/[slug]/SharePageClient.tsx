'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Fortune } from '@/lib/supabase'
import { social } from '@/lib/config'

interface Props {
  fortune: Fortune
}

export default function SharePageClient({ fortune }: Props) {
  const [newHandle, setNewHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const router = useRouter()

  const handleShare = () => {
    const tweetText = `got fortune slapped by ${social.twitter.site}`
    const shareUrl = encodeURIComponent(fortune.share_url)
    const text = encodeURIComponent(tweetText)
    
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      '_blank'
    )
  }

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // 0) Feature checks
      if (!('clipboard' in navigator) || !('write' in navigator.clipboard)) {
        throw new Error('Clipboard image write not supported')
      }
      // Safari/Chromium need ClipboardItem
      if (typeof (window as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem === 'undefined') {
        throw new Error('ClipboardItem not supported')
      }

      setCopied(true)

      // 1) Resolve a URL to fetch
      const url = imgRef.current?.src || imageUrl
      if (!url) throw new Error('No image URL')

      // 2) Fetch the image as a blob (same-origin is best; CORS headers needed otherwise)
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
      let blob = await res.blob()

      // 3) Ensure a supported MIME type (Chromium prefers image/png)
      const supported = ['image/png', 'image/jpeg']
      if (!supported.includes(blob.type)) {
        // Convert to PNG via canvas (same-origin required)
        const arrayBuf = await blob.arrayBuffer()
        const bitmap = await createImageBitmap(new Blob([arrayBuf]))
        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context not available')
        ctx.drawImage(bitmap, 0, 0)
        blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(b => (b ? resolve(b) : reject(new Error('PNG encode failed'))), 'image/png')
        )
      }

      // 4) Write image to clipboard
      const item = new (window as { ClipboardItem: typeof ClipboardItem }).ClipboardItem({ [blob.type || 'image/png']: blob })
      await navigator.clipboard.write([item])

      console.log('✅ Image copied to clipboard!')
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      console.error('❌ Failed to copy image:', err)
      setCopied(false)

      // Friendly, actionable fallback
      alert(
        'Unable to copy the image. Your browser may not support copying images to the clipboard.\n' +
        'Try Chrome/Edge on desktop. As a fallback, right-click the image → "Copy image" or "Save image as…".'
      )
    }
  }


  const handleNewFortune = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHandle.trim() || loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: newHandle.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/f/${data.slug}`)
      } else {
        console.error('Failed to generate fortune')
      }
    } catch (error) {
      console.error('Error generating fortune:', error)
    } finally {
      setLoading(false)
    }
  }

  // Build the image URL
  const imageUrl = fortune.image_url.startsWith('http')
    ? fortune.image_url
    : (typeof window !== 'undefined'
        ? new URL(fortune.image_url, window.location.origin).toString()
        : fortune.image_url) // during SSR we won't render the <img> anyway
  
  // Debug logging
  console.log('Fortune data:', fortune)
  console.log('Image URL:', imageUrl)
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #8B00B1 0%, #0E0060 25%, #090909 100%)'}}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            @{fortune.handle}&apos;s Fortune 🥠
          </h1>
        </div>

        {/* Search Bar for New Fortune */}
        <div className="mb-6">
          <form 
            onSubmit={handleNewFortune}
            className="flex gap-2 items-center w-full bg-white/90 border-none rounded-2xl p-2 focus-within:outline-1 focus-within:outline-[#FF00AA] max-md:!w-full"
            style={{ width: '100%' }}
          >
            <div className="flex items-center gap-1 w-full pl-2">
              <span className="text-base text-gray-900">@</span>
              <input 
                type="text" 
                autoFocus 
                className="w-full rounded-lg py-2 bg-transparent outline-none text-base truncate text-gray-900 placeholder-gray-500" 
                placeholder="username" 
                autoComplete="off" 
                autoCorrect="off" 
                autoCapitalize="off" 
                data-1p-ignore="true" 
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
              />
            </div>
            <button 
              type="button" 
              onClick={() => setNewHandle('')}
              className="flex items-center justify-center size-8 rounded-lg cursor-pointer mx-1 hover:opacity-80 transition-opacity"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button 
              type="submit" 
              disabled={loading || !newHandle.trim()}
              className="flex items-center justify-center gap-2 neon-button-secondary disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="size-5 mt-px -ml-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z" fill="currentColor"></path>
                  </svg>
                  Draw another
                </>
              )}
            </button>
          </form>
        </div>

        {/* Fortune Display Card */}
        <div className="neon-card">
          <div className="flex flex-col gap-4 w-full">
            {/* Text Section - Top */}
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-xl leading-tight font-display font-bold text-gray-900">
                @{fortune.handle} got fortune slapped!
              </h2>
            </div>

            {/* Large Fortune Cookie Image - Central Focus (fits viewport) */}
            <div className="w-full flex justify-center items-center">
              <img
                ref={imgRef}
                src={imageUrl}
                alt={`Fortune cookie for @${fortune.handle}`}
                className="w-full h-auto max-w-lg max-h-[50vh] rounded-2xl shadow-2xl object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl)
                  console.error('Error details:', e)
                  // fallback on the SAME origin as the page, not 3002
                  e.currentTarget.src = new URL('/assets/cookies/FCookies-BP-1.jpg', window.location.origin).toString()
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl)
                }}
              />
            </div>

            {/* Action Buttons - Bottom (smaller, organized like reference) */}
            <div className="flex flex-row items-center justify-between gap-x-4 gap-y-6 w-full max-sm:flex-col">
              <div className="flex flex-row gap-2 w-full max-sm:justify-center max-sm:flex-col max-sm:w-full">
                <button
                  onClick={handleCopyImage}
                  className="flex items-center justify-center gap-2 neon-button-secondary"
                >
                  {copied ? 'Copied!' : 'Copy'}
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 neon-button-secondary"
                >
                  Share on 
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-4 -ml-px" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => router.push('/')}
                className="group flex flex-row items-center justify-center gap-1.5 bg-gray-700 text-white hover:bg-gray-800 hover:text-purple-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 whitespace-nowrap"
              >
                <span>← Draw another</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Powered by Neon EVM */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">Powered by Neon EVM</p>
        </div>
      </div>
      
      {/* Neon Logo - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://neonevm.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          title="Visit Neon EVM"
        >
          <img 
            src="/NeonEVM_Pink-Sign.png"
            alt="Neon EVM" 
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </a>
      </div>
    </main>
  )
}
