import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShieldCheck, Wifi, Sparkles, Mail, Building2 } from 'lucide-react';

// Soft pull limits (px): a lanyard gives a lot downward, some sideways, little upward.
const PULL_LIMIT = { x: 45, down: 110, up: 16 };
// Pointer must travel this far before a press becomes a drag, so clicks and
// double-clicks never nudge the card.
const DRAG_THRESHOLD = 5;
// On touch, the card is grabbed by pressing and holding; a finger that moves
// further than TOUCH_SLOP before then is scrolling the page instead.
const LONG_PRESS_MS = 250;
const TOUCH_SLOP = 10;
// Critically damped while held (tight follow), underdamped on release (elastic snap-back).
const SPRING_HELD = { k: 420, c: 42 };
const SPRING_RELEASE = { k: 180, c: 16 };
const FLIP_MS = 900;
// Ignore a double-click that lands right after a drag (drag + click reads as dblclick).
const DRAG_DBLCLICK_GUARD_MS = 400;

// Strap geometry, relative to the card's top edge (px).
const STRAP_ANCHOR_Y = -52;
const BUCKLE_TOP_Y = -10;
const STRAP_REST_LEN = BUCKLE_TOP_Y - STRAP_ANCHOR_Y;
const STRAP_OVERLAP = 2;
const STRAP_WIDTH = 36;
const CARD_HALF_HEIGHT = 258;
const SWING_ARM = CARD_HALF_HEIGHT - BUCKLE_TOP_Y;

const REST = { x: 0, y: 0 };
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const toRad = (deg) => (deg * Math.PI) / 180;

// Rubber-band easing so the pull feels elastic and resists near the limit.
const rubberBand = (delta, max) =>
  Math.sign(delta) * max * (1 - Math.exp(-Math.abs(delta) / max));

const CardShellDecor = () => (
  <>
    {/* Polished bevel highlights and inner shadow on the strip border */}
    <div className="absolute inset-0 rounded-[34px] border border-white/25 pointer-events-none z-20"></div>
    <div className="absolute inset-0 rounded-[34px] shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] pointer-events-none z-20"></div>
    {/* Lanyard Hole punch cut-out through top border */}
    <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-neutral-950 border border-neutral-700/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] z-30"></div>
  </>
);

const Card3D = ({ member }) => {
  const description =
    member.description ||
    `Official digital identity pass issued to the ${member.role} of the ${member.committee}. This pass grants access to committee events, resources, and verified TPC digital services.`;

  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');

  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(REST);

  const cardRef = useRef(null);
  const pressRef = useRef(null);
  const dragTargetRef = useRef(REST);
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const lastFrameRef = useRef(null);
  const rafIdRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isFlippingRef = useRef(false);
  const flipTimerRef = useRef(null);
  const lastDragEndRef = useRef(0);
  const longPressTimerRef = useRef(null);

  // Damped spring stepped every frame toward the pointer (held) or rest (released).
  const tick = useCallback(function step(now) {
    const last = lastFrameRef.current ?? now;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    lastFrameRef.current = now;

    const held = isDraggingRef.current;
    const target = held ? dragTargetRef.current : REST;
    const { k, c } = held ? SPRING_HELD : SPRING_RELEASE;
    const pos = posRef.current;
    const vel = velRef.current;

    vel.x += (k * (target.x - pos.x) - c * vel.x) * dt;
    vel.y += (k * (target.y - pos.y) - c * vel.y) * dt;
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    const settled =
      !held &&
      Math.abs(pos.x) < 0.05 &&
      Math.abs(pos.y) < 0.05 &&
      Math.abs(vel.x) < 0.5 &&
      Math.abs(vel.y) < 0.5;

    if (settled) {
      posRef.current = { x: 0, y: 0 };
      velRef.current = { x: 0, y: 0 };
      lastFrameRef.current = null;
      rafIdRef.current = null;
      setDragOffset(REST);
      return;
    }

    setDragOffset({ x: pos.x, y: pos.y });
    rafIdRef.current = requestAnimationFrame(step);
  }, []);

  const ensureLoop = useCallback(() => {
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      clearTimeout(flipTimerRef.current);
      clearTimeout(longPressTimerRef.current);
    };
  }, []);

  // Once a touch drag has started, stop the page from scrolling under it. This has to be a
  // native non-passive listener; React's touch handlers can't call preventDefault.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const blockScrollWhileDragging = (e) => {
      if (isDraggingRef.current) e.preventDefault();
    };
    el.addEventListener('touchmove', blockScrollWhileDragging, { passive: false });
    return () => el.removeEventListener('touchmove', blockScrollWhileDragging);
  }, []);

  // Drag-to-pull lanyard interaction
  const startDrag = (pointerId) => {
    cardRef.current?.setPointerCapture(pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handlePointerDown = (e) => {
    if (isFlippingRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const isTouch = e.pointerType !== 'mouse';
    pressRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, isTouch };

    if (isTouch) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = setTimeout(() => {
        if (pressRef.current?.id !== e.pointerId) return;
        startDrag(e.pointerId);
        navigator.vibrate?.(10);
      }, LONG_PRESS_MS);
    }
  };

  const handlePointerMove = (e) => {
    const press = pressRef.current;
    if (!press || press.id !== e.pointerId) return;

    const rawX = e.clientX - press.x;
    const rawY = e.clientY - press.y;

    if (!isDraggingRef.current) {
      if (press.isTouch) {
        // Moved before the hold completed: this is a scroll, let the browser have it.
        if (Math.hypot(rawX, rawY) > TOUCH_SLOP) {
          clearTimeout(longPressTimerRef.current);
          pressRef.current = null;
        }
        return;
      }
      if (Math.hypot(rawX, rawY) < DRAG_THRESHOLD) return;
      startDrag(e.pointerId);
    }

    dragTargetRef.current = {
      x: rubberBand(rawX, PULL_LIMIT.x),
      y: rubberBand(rawY, rawY >= 0 ? PULL_LIMIT.down : PULL_LIMIT.up),
    };
    ensureLoop();
  };

  const handlePointerEnd = (e) => {
    const press = pressRef.current;
    if (!press || press.id !== e.pointerId) return;
    clearTimeout(longPressTimerRef.current);
    pressRef.current = null;
    if (!isDraggingRef.current) return;

    if (cardRef.current?.hasPointerCapture(e.pointerId)) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    lastDragEndRef.current = performance.now();
    setIsDragging(false);
    ensureLoop();
  };

  const handleDoubleClick = () => {
    if (isDraggingRef.current) return;
    if (performance.now() - lastDragEndRef.current < DRAG_DBLCLICK_GUARD_MS) return;

    setIsFlipped((flipped) => !flipped);
    // Ignore drags until the flip finishes.
    isFlippingRef.current = true;
    clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      isFlippingRef.current = false;
    }, FLIP_MS);
  };

  // The card swings about its centre, leaning its top back toward the strap anchor.
  const swingDeg = clamp(-dragOffset.x * 0.14, -10, 10);
  const swingRad = toRad(swingDeg);

  // Where the buckle actually is after translate + swing, and the strap that reaches it
  // from its fixed anchor.
  const buckleX = dragOffset.x + SWING_ARM * Math.sin(swingRad);
  const buckleY = BUCKLE_TOP_Y + dragOffset.y + SWING_ARM * (1 - Math.cos(swingRad));
  const strapDY = buckleY - STRAP_ANCHOR_Y;
  const strapLen = Math.max(Math.hypot(buckleX, strapDY), 1);
  const strapAngle = (-Math.atan2(buckleX, strapDY) * 180) / Math.PI;
  const strapStretch = strapLen / STRAP_REST_LEN;
  // Elastic thins as it stretches.
  const strapWidthRatio = clamp(1 / Math.sqrt(strapStretch), 0.7, 1);
  const strapWidth = STRAP_WIDTH * strapWidthRatio;

  return (
    <div className="w-full flex flex-col items-center justify-center mt-2 mb-2 select-none">
      {/* 3D Perspective Scene Container */}
      <div
        className="perspective-1200 pt-14 pb-2"
        style={{ perspective: '1200px' }}
      >
        {/* Strap + card stage */}
        <div
          className="relative w-[326px] sm:w-[356px] h-[516px] preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Lanyard Fabric Strap — top end stays anchored, the rest stretches to follow the card */}
          <div
            className="absolute bg-tpc-strip rounded-t-md border-x border-neutral-700/80 shadow-lg flex items-center justify-center overflow-hidden pointer-events-none z-40"
            style={{
              top: STRAP_ANCHOR_Y,
              left: '50%',
              width: strapWidth,
              height: strapLen + STRAP_OVERLAP,
              marginLeft: -strapWidth / 2,
              transformOrigin: 'top center',
              transform: `translateZ(12px) rotate(${strapAngle}deg)`,
              // Uniform scale only: the SVG letterboxes if its aspect ratio changes.
              backgroundSize: `${60 * strapWidthRatio}px ${40 * strapWidthRatio}px`,
            }}
          >
            <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
            <div className="absolute inset-y-0 w-1 bg-green-400/40 blur-[1px]"></div>
            {/* Stitching lines */}
            <div className="absolute left-1 inset-y-0 w-[1px] bg-neutral-950/40 border-l border-dashed border-white/20"></div>
            <div className="absolute right-1 inset-y-0 w-[1px] bg-neutral-950/40 border-r border-dashed border-white/20"></div>
          </div>

          {/* Draggable Card — pulled on the lanyard, springs back on release */}
          <div
            ref={cardRef}
            className="absolute inset-0 preserve-3d"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onDoubleClick={handleDoubleClick}
            // Long-pressing is how touch users grab the card, so suppress the OS context menu.
            onContextMenu={(e) => e.preventDefault()}
            style={{
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotateZ(${swingDeg}deg)`,
              transformStyle: 'preserve-3d',
              cursor: isDragging ? 'grabbing' : 'grab',
              WebkitTouchCallout: 'none',
            }}
          >
          {/* Metallic Clip Buckle + Ring — attached to the card, so they travel with it */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-40"
            style={{ top: BUCKLE_TOP_Y, transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}
          >
            <div className="w-14 h-4 bg-gradient-to-r from-neutral-500 via-neutral-100 to-neutral-500 rounded-sm shadow-xl border border-neutral-300 flex items-center justify-center z-10">
              <div className="w-8 h-1.5 bg-neutral-900 rounded-full border border-neutral-700 shadow-inner"></div>
            </div>

            {/* Metallic Ring looping directly through the card hole */}
            <div className="w-5 h-6 rounded-full border-[2.5px] border-neutral-200 shadow-[0_2px_6px_rgba(0,0,0,0.8)] -mt-1 bg-transparent z-20"></div>
          </div>

          {/* Flip Wrapper: rotates the ENTIRE physical card (shell + face) on double-click */}
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.9s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          >
            {/* FRONT — Geometric Strip Border Frame + Card Face */}
            <div
              className="absolute inset-0 rounded-[34px] p-[8px] sm:p-[10px] bg-tpc-strip shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(34,197,94,0.35)] border border-green-500/50 preserve-3d"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              <CardShellDecor />

              {/* Card Face (Inner Body) */}
              <div
                className="relative w-full h-full rounded-[24px] bg-gradient-to-b from-neutral-900/95 via-black/98 to-neutral-950 border border-neutral-700/80 p-5 sm:p-5.5 flex flex-col justify-between overflow-hidden shadow-2xl"
                style={{ transformStyle: 'preserve-3d' }}
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
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          draggable={false}
                          className="w-full h-full object-cover rounded-[20px]"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={member.name}
                          className="w-full h-full rounded-[20px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center"
                        >
                          <span className="text-5xl font-black tracking-wider text-green-400/90 drop-shadow-[0_0_18px_rgba(34,197,94,0.45)]">
                            {initials}
                          </span>
                        </div>
                      )}
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
                    {member.name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-green-950/60 border border-green-500/50">
                    <span className="text-[12px] font-bold text-green-400 tracking-widest uppercase">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 tracking-wider uppercase font-medium mt-0.5">
                    {member.committee}
                  </p>
                </div>
              </div>
            </div>

            {/* BACK — Geometric Strip Border Frame + Description Face */}
            <div
              className="absolute inset-0 rounded-[34px] p-[8px] sm:p-[10px] bg-tpc-strip shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(34,197,94,0.35)] border border-green-500/50 preserve-3d"
              style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(180deg)',
              }}
            >
              <CardShellDecor />

              <div className="relative w-full h-full rounded-[24px] bg-gradient-to-b from-neutral-900/95 via-black/98 to-neutral-950 border border-neutral-700/80 p-5 sm:p-5.5 flex flex-col overflow-hidden shadow-2xl">
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
                      {description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-1">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span className="text-[11px] text-neutral-400">
                        {member.college}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span className="text-[11px] text-neutral-400">
                        {member.email}
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
        </div>
      </div>

      {/* Helper cue */}
      <p className="text-[11px] text-neutral-500 tracking-wider mt-3 font-mono flex items-center gap-1.5 text-center">
        <Sparkles className="w-3 h-3 text-green-400/80 shrink-0" />
        <span>Double-tap to flip</span>
      </p>
    </div>
  );
};

export default Card3D;
