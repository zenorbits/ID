import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800/80 bg-black/40 backdrop-blur-md px-4 py-8 mt-6">
      <div className="max-w-sm mx-auto flex flex-col gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <h2 className="text-white font-bold text-[14px] tracking-wider uppercase">
            MES College Committee
          </h2>
        </div>
        <p className="text-neutral-400 text-[12px]">
          © 2026 – 2027 Training &amp; Placement Cell • Official Digital Credential
        </p>
      </div>
    </footer>
  );
}