import React from 'react'

const Header = () => {
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
        <div className="px-4 py-1.5 rounded-full bg-neutral-900/80 border border-green-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.15)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-widest text-green-300 font-bold">
            2026–2027
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header