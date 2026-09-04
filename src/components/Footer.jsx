import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full relative mt-12 overflow-hidden border-t-2 border-green-500/50 shadow-[0_-5px_25px_rgba(34,197,94,0.3)]">
      {/* Full Geometric Triangle Strips Background - Balanced scale for optimal clarity */}
      <div className="absolute inset-0 bg-tpc-strip-lg bg-repeat opacity-95 [background-size:150px_100px] sm:[background-size:180px_120px]"></div>

      {/* Minimal transparency dark overlay for contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50 pointer-events-none"></div>

      {/* Top glowing edge line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_12px_rgba(34,197,94,0.8)] pointer-events-none"></div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-8 sm:py-10">
        <div className="bg-black/75 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <h2 className="text-white font-bold text-[15px] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              MES College Committee
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-green-950/90 border border-green-500/60 text-[11px] text-green-400 font-mono font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              TPC-PCE 2025-26
            </span>
          </div>
          <p className="text-neutral-300 text-[12px] leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            © 2026 – 2027 Training &amp; Placement Committee • Official Digital Credential
          </p>
        </div>
      </div>
    </footer>
  );
}
