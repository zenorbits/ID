import React, { useEffect, useRef, useState } from 'react'
import { Share2, Check } from 'lucide-react'

const Header = () => {
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(resetTimerRef.current), [])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <header className="w-full max-w-md sm:max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-3">
        <a
          href="https://tpc.pce.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit TPC-PCE Website"
          className="inline-block cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-xl"
        >
          <img
            src="https://v0-chirayu-durgude.vercel.app/tpc-logo.svg"
            alt="TPC Logo"
            className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_0_24px_rgba(34,197,94,0.45)] transition-all hover:scale-105 hover:opacity-90 duration-300 cursor-pointer"
          />
        </a>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this ID"
          className="px-4 py-1.5 rounded-full bg-neutral-900/80 border border-green-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.15)] flex items-center gap-2 cursor-pointer transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.35)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-green-400" strokeWidth={2.2} />
          )}
          <span className="text-[11px] font-mono tracking-widest text-green-300 font-bold uppercase">
            {copied ? 'Link copied' : 'Share'}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header