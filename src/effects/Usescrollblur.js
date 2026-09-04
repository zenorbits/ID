import { useEffect } from "react";

/**
 * useScrollBlur hook
 *
 * Recreates the exact scroll-driven scrub reveal from v0-chirayu-durgude.vercel.app:
 * - GSAP ScrollTrigger equivalent:
 *   trigger: targetRef.current
 *   start: "top bottom-=10%" (when target top is at 90% of viewport height)
 *   end: "bottom bottom-=15%" (when target bottom is at 85% of viewport height)
 *   scrub: true
 *   ease: "power2.out" -> f(p) = 1 - (1 - p)^2
 *   from: { opacity: baseOpacity, y: baseY, filter: `blur(${blurStrength}px)` }
 *   to:   { opacity: 1, y: 0, filter: "blur(0px)" }
 *
 * - Continuous 60/120fps hardware-accelerated RAF scrub
 * - Smoothly reversible when scrolling up
 * - Once fully reached, removes filter ("none") for zero GPU overhead and crisp rendering
 *
 * @param {React.RefObject} targetRef - Ref to the target element
 * @param {object} [options] - Configuration options
 */
export default function useScrollBlur(targetRef, options = {}) {
  const {
    enableBlur = true,
    baseOpacity = 0.05,
    baseY = 40,
    blurStrength = 8,
    // "top bottom-=10%" -> start when element top reaches 90% of viewport
    startRatio = 0.90,
    // "bottom bottom-=15%" -> end when element bottom reaches 85% of viewport
    endOffsetRatio = 0.15,
  } = options;

  useEffect(() => {
    const el = targetRef?.current;
    if (!el) return;

    // Optimize for GPU compositor layer
    el.style.willChange = "transform, opacity, filter";
    el.style.transformStyle = "preserve-3d";

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh =
        window.innerHeight || document.documentElement.clientHeight || 800;

      // GSAP trigger bounds:
      // start: element top reaches (vh * startRatio)
      const start = vh * startRatio;
      // end: element bottom reaches (vh * (1 - endOffsetRatio))
      // Since rect.bottom = rect.top + rect.height, this equals:
      const end = vh * (1 - endOffsetRatio) - rect.height;

      // Total scrub distance
      const distance = Math.max(1, start - end);

      // Scrub progress [0, 1]
      const rawProgress = (start - rect.top) / distance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      // GSAP power2.out easing: 1 - (1 - p)^2
      const eased = 1 - (1 - clamped) * (1 - clamped);

      const opacity = baseOpacity + (1 - baseOpacity) * eased;
      const y = baseY * (1 - eased);
      const blur = enableBlur ? blurStrength * (1 - eased) : 0;

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Run initial frame and backup check for layout stabilization
    update();
    const initRaf = requestAnimationFrame(update);
    const backupTimer = setTimeout(update, 120);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onScroll);
    }

    return () => {
      cancelAnimationFrame(initRaf);
      clearTimeout(backupTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onScroll);
      }
      if (el) {
        el.style.willChange = "";
        el.style.transform = "";
        el.style.opacity = "";
        el.style.filter = "";
      }
    };
  }, [
    targetRef,
    enableBlur,
    baseOpacity,
    baseY,
    blurStrength,
    startRatio,
    endOffsetRatio,
  ]);
}