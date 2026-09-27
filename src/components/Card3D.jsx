import React, { useState, useRef } from 'react';
import { ShieldCheck, Wifi, Sparkles, IdCard, Mail, Building2, CalendarClock } from 'lucide-react';

// How far the card can be pulled from its resting position, in px.
const MAX_PULL = 90;

// Rubber-band easing so the pull feels elastic and resists near the limit.
const rubberBand = (delta, max) =>
  Math.sign(delta) * max * (1 - Math.exp(-Math.abs(delta) / max));

const Card3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // 3D Tilt angles
  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current || isDragging) return;
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
    if (!cardRef.current || !e.touches[0] || isDragging) return;
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

  // Drag-to-pull lanyard interaction
  const handlePointerDown = (e) => {
    if (!cardRef.current) return;
    cardRef.current.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    setDragOffset({
      x: rubberBand(rawX, MAX_PULL),
      y: rubberBand(rawY, MAX_PULL),
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    setIsFlipped((flipped) => !flipped);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-2 mb-2 select-none">
      {/* 3D Perspective Scene Container */}
      <div
        className="perspective-1200 cursor-pointer pt-14 pb-2"
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
          className="relative w-[326px] sm:w-[356px] h-[516px] rounded-[34px] p-[8px] sm:p-[10px] bg-tpc-strip shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(34,197,94,0.35)] border border-green-500/50 preserve-3d touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg)`,
            transformStyle: 'preserve-3d',
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging
              ? 'none'
              : isHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* ATTACHED 3D Lanyard Strap & Metallic Buckle Assembly (Moves with Card) */}
          <div
            className="absolute -top-13 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-40"
            style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}
          >
            {/* Lanyard Fabric Strap with TPC Geometric Pattern */}
            <div className="w-9 h-11 bg-tpc-strip rounded-t-md border-x border-neutral-700/80 shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
              <div className="absolute inset-y-0 w-1 bg-green-400/40 blur-[1px]"></div>
              {/* Stitching lines */}
              <div className="absolute left-1 inset-y-0 w-[1px] bg-neutral-950/40 border-l border-dashed border-white/20"></div>
              <div className="absolute right-1 inset-y-0 w-[1px] bg-neutral-950/40 border-r border-dashed border-white/20"></div>
            </div>

            {/* Metallic Clip Buckle */}
            <div className="w-14 h-4 bg-gradient-to-r from-neutral-500 via-neutral-100 to-neutral-500 rounded-sm shadow-xl border border-neutral-300 flex items-center justify-center -mt-0.5 z-10">
              <div className="w-8 h-1.5 bg-neutral-900 rounded-full border border-neutral-700 shadow-inner"></div>
            </div>

            {/* Metallic Ring looping directly through the card hole */}
            <div className="w-5 h-6 rounded-full border-[2.5px] border-neutral-200 shadow-[0_2px_6px_rgba(0,0,0,0.8)] -mt-1 bg-transparent z-20"></div>
          </div>

          {/* Polished bevel highlights and inner shadow on the strip border */}
          <div className="absolute inset-0 rounded-[34px] border border-white/25 pointer-events-none z-20"></div>
          <div className="absolute inset-0 rounded-[34px] shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] pointer-events-none z-20"></div>

          {/* Lanyard Hole punch cut-out through top border */}
          <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] z-30"></div>

          {/* Flip Container: rotates on double-click to reveal the back face */}
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          >
          {/* Card Face (Front) */}
          <div
            className="absolute inset-0 w-full h-full rounded-[24px] bg-gradient-to-b from-neutral-900/95 via-black/98 to-neutral-950 border border-neutral-700/80 p-5 sm:p-5.5 flex flex-col justify-between overflow-hidden shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
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
              className="relative z-20 text-center flex flex-col items-center gap-1.5 mb-2"
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
                Training &amp; Placement Committee
              </p>
            </div>
          </div>

          {/* Card Face (Back) — Description Side */}
          <div
            className="absolute inset-0 w-full h-full rounded-[24px] bg-gradient-to-b from-neutral-900/95 via-black/98 to-neutral-950 border border-neutral-700/80 p-5 sm:p-5.5 flex flex-col overflow-hidden shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Subtle cyber grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60"></div>

            {/* Magnetic stripe */}
            <div className="relative z-20 -mx-5 sm:-mx-5.5 mt-1 h-9 bg-neutral-950 border-y border-neutral-800"></div>

            <div className="relative z-20 flex flex-col gap-4 mt-5 flex-1">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-green-400 uppercase">
                  Card Description
                </span>
                <p className="text-[12px] text-neutral-300 leading-relaxed mt-1.5">
                  Official digital identity pass issued to the Technical Head
                  of the Training &amp; Placement Committee. This pass grants
                  access to committee events, resources, and verified TPC
                  digital services.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 mt-1">
                <div className="flex items-center gap-2.5">
                  <IdCard className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-[11px] text-neutral-400">
                    ID No.{' '}
                    <span className="text-neutral-200 font-semibold">
                      TPC-2026-001
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-[11px] text-neutral-400">
                    MES College of Engineering
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-[11px] text-neutral-400">
                    chirayudurgude@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarClock className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="text-[11px] text-neutral-400">
                    Valid Thru{' '}
                    <span className="text-neutral-200 font-semibold">
                      2026 – 2027
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 text-center pt-3 border-t border-neutral-800">
              <p className="text-[9px] text-neutral-500 tracking-wide uppercase leading-relaxed">
                Property of TPC. If found, please return to the
                Training &amp; Placement Committee.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Helper cue */}
      <p className="text-[11px] text-neutral-500 tracking-wider mt-3 font-mono flex items-center gap-1.5 text-center">
        <Sparkles className="w-3 h-3 text-green-400/80 shrink-0" />
        <span>Double-click to flip · Hold &amp; drag to pull the lanyard</span>
      </p>
    </div>
  );
};

export default Card3D;

