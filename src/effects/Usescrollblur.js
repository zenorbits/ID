import { useEffect, useState, useRef } from "react";

/**
 * useScrollBlur hook
 *
 * Provides an intelligent, high-performance scroll blur effect:
 * - Only blurs when actively scrolling DOWN TOWARDS the target element.
 * - Once the user reaches the element ("after reaching there"), the blur effect
 *   is completely disabled so the content stays crisp and readable.
 * - If the user scrolls back up to the top, the state resets so approaching it again
 *   can re-trigger the focus-in effect.
 * - Gracefully unblurs when scrolling stops before reaching the target.
 *
 * Mobile-hardened:
 * - Viewport height is cached and only recomputed on a debounced resize,
 *   instead of being re-read (and re-triggering blur logic) on every
 *   mobile address-bar show/hide event.
 * - scrollY is clamped to the valid [0, maxScroll] range so iOS/Android
 *   rubber-band overscroll doesn't produce a false "scrolling down" delta.
 * - A small delta threshold + short hysteresis window smooths out the
 *   many tiny/rapid scroll events fired during touch momentum scrolling,
 *   preventing on/off flicker.
 *
 * @param {React.RefObject | object | number} targetOrOptions - ref to target element or options
 * @param {object} [maybeOptions] - configuration options
 */
export default function useScrollBlur(targetOrOptions, maybeOptions = {}) {
  let targetRef = null;
  let config = {};

  if (targetOrOptions && "current" in targetOrOptions) {
    targetRef = targetOrOptions;
    config = maybeOptions || {};
  } else if (typeof targetOrOptions === "object" && targetOrOptions !== null) {
    config = targetOrOptions;
    targetRef = config.targetRef || null;
  } else if (typeof targetOrOptions === "number") {
    config = { delay: targetOrOptions, ...(maybeOptions || {}) };
  }

  const {
    delay = 180,
    reachRatio = 0.55,
    resetRatio = 0.8,
    resetScrollY = 70,
    // minimum scroll movement (px) before we treat it as an intentional
    // scroll-down — filters out sub-pixel jitter from touch momentum
    minDelta = 2,
  } = config;

  const [isBlurred, setIsBlurred] = useState(false);
  const isBlurredRef = useRef(false);
  const timeoutRef = useRef(null);
  const tickingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const hasReachedRef = useRef(false);

  // cached, debounce-updated viewport height — avoids reading
  // window.innerHeight on every single scroll tick, which on mobile
  // changes as the address bar collapses/expands mid-scroll
  const viewportHeightRef = useRef(
    typeof window !== "undefined"
      ? window.innerHeight || document.documentElement.clientHeight || 800
      : 800
  );
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const getMaxScroll = () => {
      const doc = document.documentElement;
      return Math.max(0, doc.scrollHeight - viewportHeightRef.current);
    };

    // clamp scrollY into valid bounds so iOS/Android rubber-band
    // overscroll (negative or beyond-max values) can't produce a
    // spurious "scrolling down" delta
    const getScrollY = () => {
      const raw =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      return Math.min(Math.max(raw, 0), getMaxScroll());
    };

    lastScrollYRef.current = getScrollY();

    const checkInitialPosition = () => {
      if (!targetRef?.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const reachThreshold = viewportHeightRef.current * reachRatio;

      if (rect.top <= reachThreshold) {
        hasReachedRef.current = true;
      }
    };

    checkInitialPosition();
    const rafId = requestAnimationFrame(checkInitialPosition);

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = getScrollY();
        const delta = currentScrollY - lastScrollYRef.current;
        const isScrollingDown = delta > minDelta;
        const isScrollingUp = delta < -minDelta;

        if (targetRef?.current) {
          const rect = targetRef.current.getBoundingClientRect();
          const reachThreshold = viewportHeightRef.current * reachRatio;
          const resetThreshold = viewportHeightRef.current * resetRatio;

          if (rect.top <= reachThreshold) {
            hasReachedRef.current = true;
          } else if (rect.top > resetThreshold || currentScrollY < resetScrollY) {
            hasReachedRef.current = false;
          }
        }

        // only blur on a deliberate scroll-down that hasn't reached target;
        // explicitly bail on scroll-up too so bounce-back after overscroll
        // doesn't get misread
        const shouldBlur =
          isScrollingDown && !isScrollingUp && !hasReachedRef.current;

        if (shouldBlur) {
          if (!isBlurredRef.current) {
            isBlurredRef.current = true;
            setIsBlurred(true);
          }

          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            if (isBlurredRef.current) {
              isBlurredRef.current = false;
              setIsBlurred(false);
            }
          }, delay);
        } else {
          if (isBlurredRef.current) {
            isBlurredRef.current = false;
            setIsBlurred(false);
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }

        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    // resize is handled SEPARATELY from scroll on purpose: on mobile,
    // resize fires repeatedly mid-scroll as the address bar/toolbar
    // collapses or expands. Running the full blur logic on every one of
    // those events (as before, via the same handler) is the main source
    // of mobile glitching. Here we only update the cached viewport
    // height, debounced, without touching blur state directly.
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        viewportHeightRef.current =
          window.innerHeight || document.documentElement.clientHeight || 800;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // visualViewport fires more reliably than window resize for mobile
    // address-bar/keyboard changes on iOS Safari and Chrome Android
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [targetRef, delay, reachRatio, resetRatio, resetScrollY, minDelta]);

  return isBlurred;
}