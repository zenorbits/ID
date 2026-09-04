import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full relative mt-10">
      {/* Decorative TPC Geometric Triangle Strip Banner */}
      <div className="w-full relative">
        {/* Neon green ambient glow */}
        <div className="absolute inset-x-0 -top-1.5 h-4 bg-green-500/25 blur-md pointer-events-none"></div>

        {/* Continuous Geometric Strip Band */}
        <div className="w-full h-3.5 sm:h-4 bg-tpc-strip border-y border-green-500/40 relative shadow-[0_0_20px_rgba(34,197,94,0.3)] overflow-hidden">
          {/* Laminated glossy sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/25 pointer-events-none"></div>
        </div>
      </div>

      {/* Footer Body */}
      <div className="w-full bg-neutral-950/85 backdrop-blur-md px-4 py-8 border-b border-neutral-900">
        <div className="max-w-md mx-auto flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <h2 className="text-white font-bold text-[14px] tracking-wider uppercase">
              MES College Committee
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-green-950/80 border border-green-500/50 text-[10px] text-green-400 font-mono font-semibold tracking-wider uppercase shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              TPC-PCE 2025-26
            </span>
          </div>
          <p className="text-neutral-400 text-[12px] leading-relaxed">
            © 2026 – 2027 Training &amp; Placement Cell • Official Digital Credential
          </p>
        </div>
      </div>
    </footer>
  );
}
