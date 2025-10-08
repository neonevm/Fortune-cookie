'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { social } from '@/lib/config'

interface FortuneResponse {
  slug: string
  shareUrl: string
  image: {
    id: string
    url: string
  }
}

export default function Home() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fortune, setFortune] = useState<FortuneResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handle.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: handle.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate fortune')
      }

      setFortune(data)
      // Navigate to the share page
      router.push(`/f/${data.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (fortune) {
      const tweetText = `got fortune slapped by ${social.twitter.site}`
      const shareUrl = encodeURIComponent(fortune.shareUrl)
      const text = encodeURIComponent(tweetText)
      
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
        '_blank'
      )
    }
  }

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!fortune) return
    
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
      const url = imgRef.current?.src || fortune.image.url
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


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #8B00B1 0%, #0E0060 25%, #090909 100%)'}}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Mean Crypto Fortune Cookie 🥠
          </h1>
          <p className="text-white/90 text-sm">
            Enter your X handle and get roasted by the crypto gods
          </p>
        </div>

        {/* Form */}
        <div className="neon-card">
          {!fortune ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="handle" className="block text-sm font-medium text-gray-900 mb-2">
                  X Handle
                </label>
                <input
                  type="text"
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@vitalik"
                  className="w-full px-4 py-3 bg-white/90 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF00AA]"
                  disabled={loading}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter without the @ symbol
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !handle.trim()}
                className="w-full py-3 neon-button disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Draw'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Text Section - Top */}
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-xl leading-tight font-display font-bold text-gray-900">
                  @{handle}&apos;s fortune is ready!
                </h2>
              </div>

              {/* Large Fortune Cookie Image - Central Focus (fits viewport) */}
              <div className="w-full flex justify-center items-center">
                <img
                  ref={imgRef}
                  src={fortune.image.url}
                  alt={`Fortune cookie for @${handle}`}
                  className="w-full h-auto max-w-lg max-h-[50vh] rounded-2xl shadow-2xl object-contain"
                  onError={(e) => {
                    console.error('Image failed to load:', fortune.image.url)
                    console.error('Error details:', e)
                    // fallback on the SAME origin as the page
                    e.currentTarget.src = new URL('/assets/cookies/Fortune Cookie 1.png', window.location.origin).toString()
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', fortune.image.url)
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
                  onClick={() => {
                    setFortune(null)
                    setHandle('')
                    setError('')
                  }}
                  className="group flex flex-row items-center justify-center gap-1.5 bg-gray-700 text-white hover:bg-gray-800 hover:text-purple-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 whitespace-nowrap"
                >
                  <span>Generate Another</span>
                </button>
              </div>
            </div>
          )}
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