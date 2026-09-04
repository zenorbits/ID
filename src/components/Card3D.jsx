import React, { useState, useRef } from 'react';
import { ShieldCheck, Wifi, Sparkles } from 'lucide-react';

const Card3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // 3D Tilt angles
  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-16 to 16 deg)
    const rotY = ((x - centerX) / centerX) * 16;
    const rotX = -((y - centerY) / centerY) * 16;

    setTransformStyle({
      rotateX: rotX,
      rotateY: rotY,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle({
      rotateX: 0,
      rotateY: 0,
    });
  };

  // Mobile Touch Support
  const handleTouchMove = (e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotY = ((x - centerX) / centerX) * 14;
    const rotX = -((y - centerY) / centerY) * 14;

    setTransformStyle({
      rotateX: rotX,
      rotateY: rotY,
    });
  };


  const handleTouchEnd = () => {
    handleMouseLeave();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 select-none">
      {/* 3D Lanyard Strap & Clip at Top */}
      <div className="flex flex-col items-center pointer-events-none -mb-3 z-30">
        {/* Lanyard Fabric Strap with TPC Geometric Pattern */}
        <div className="w-8 h-10 bg-tpc-strip rounded-t-sm border-x border-neutral-700/80 shadow-md flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
          <div className="absolute inset-y-0 w-1 bg-green-400/30 blur-[1px]"></div>
        </div>
        {/* Metallic Clip Buckle */}
        <div className="w-14 h-4 bg-gradient-to-r from-neutral-500 via-neutral-200 to-neutral-500 rounded-sm shadow-lg border border-neutral-400/80 flex items-center justify-center -mt-0.5">
          <div className="w-8 h-1.5 bg-neutral-900 rounded-full border border-neutral-700"></div>
        </div>
        {/* Metallic Ring */}
        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 shadow-inner -mt-1 bg-transparent"></div>
      </div>

      {/* 3D Perspective Scene Container */}
      <div
        className="perspective-1200 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: '1200px' }}
      >
        {/* 3D Transform Card Root with Geometric Strip Border Frame */}
        <div
          ref={cardRef}
          className="relative w-[326px] sm:w-[356px] h-[516px] rounded-[34px] p-[8px] sm:p-[10px] bg-tpc-strip shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(34,197,94,0.35)] border border-green-500/50 transition-transform duration-500 ease-out preserve-3d"
          style={{
            transform: `rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* Polished bevel highlights and inner shadow on the strip border */}
          <div className="absolute inset-0 rounded-[34px] border border-white/25 pointer-events-none z-20"></div>
          <div className="absolute inset-0 rounded-[34px] shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] pointer-events-none z-20"></div>

          {/* Lanyard Hole punch cut-out through top border */}
          <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] z-30"></div>

          {/* Card Face (Inner Body) */}
          <div
            className="relative w-full h-full rounded-[24px] bg-gradient-to-b from-neutral-900/95 via-black/98 to-neutral-950 border border-neutral-700/80 p-5 sm:p-5.5 flex flex-col justify-between overflow-hidden shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Subtle cyber grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60"></div>

            {/* HEADER: Microchip & Status */}
            <div
              className="relative z-20 flex items-center justify-between mt-1 pt-1"
              style={{ transform: 'translateZ(25px)' }}
            >
              {/* EMV Cyber Smartchip */}
              <div className="relative w-11 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-md border border-amber-300/40">
                <div className="w-full h-full rounded-[5px] bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 relative flex items-center justify-center overflow-hidden">
                  {/* Chip circuitry lines */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-800/60"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-800/60"></div>
                  <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-800/60"></div>
                  <div className="w-3 h-3 rounded-full border border-amber-800/60"></div>
                </div>
              </div>

              {/* Verified Status Pill */}
              <div className="flex items-center gap-2 bg-neutral-900/90 border border-green-500/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-widest text-green-400 uppercase">
                  Active Pass
                </span>
              </div>

              {/* Contactless Wifi Icon */}
              <div className="text-neutral-400">
                <Wifi className="w-5 h-5 -rotate-90 text-neutral-400" />
              </div>
            </div>

            {/* CENTER: Profile Photo with 3D Parallax Depth */}
            <div
              className="relative z-20 flex flex-col items-center mt-1"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="relative">
                {/* Glowing neon aura behind photo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-green-500/30 to-cyan-500/20 rounded-[28px] blur-lg opacity-75"></div>

                {/* Photo frame */}
                <div className="relative w-[180px] h-[215px] sm:w-[200px] sm:h-[235px] rounded-[22px] p-[2px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-800 shadow-2xl overflow-hidden border border-neutral-600/40">
                  <img
                    src="https://v0-chirayu-durgude.vercel.app/profile.png"
                    alt="Chirayu Durgude"
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                  {/* Corner cyber brackets */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-green-400"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-green-400"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-green-400"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-green-400"></div>
                </div>

                {/* Authenticity Seal badge */}
                <div
                  className="absolute -bottom-3 -right-2 bg-neutral-900 border border-neutral-700/80 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-lg"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[9px] font-bold text-neutral-200 tracking-wider">
                    TPC AUTH
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER: Name & Designation */}
            <div
              className="relative z-20 text-center flex flex-col items-center gap-1 mb-1"
              style={{ transform: 'translateZ(30px)' }}
            >
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Chirayu Durgude
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-green-950/60 border border-green-500/50">
                <span className="text-[12px] font-bold text-green-400 tracking-widest uppercase">
                  Technical Head
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 tracking-wider uppercase font-medium mt-0.5">
                Training &amp; Placement Cell
              </p>
            </div>

            {/* Bottom Security Strip with Geometric Mosaic */}
            <div
              className="relative z-20 h-2.5 w-full rounded-full bg-tpc-strip border border-green-400/50 shadow-[0_0_12px_rgba(34,197,94,0.35)] overflow-hidden"
              style={{ transform: 'translateZ(15px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper cue */}
      <p className="text-[11px] text-neutral-500 tracking-wider mt-3 font-mono flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-green-400/80" />
        <span>Hover or drag to tilt in 3D</span>
      </p>
    </div>
  );
};

export default Card3D;

