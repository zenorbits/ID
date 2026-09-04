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
  } = config;

  const [isBlurred, setIsBlurred] = useState(false);
  const isBlurredRef = useRef(false);
  const timeoutRef = useRef(null);
  const tickingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const hasReachedRef = useRef(false);

  useEffect(() => {
    // Initialize scroll position
    const getScrollY = () =>
      Math.max(
        0,
        window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          0
      );

    lastScrollYRef.current = getScrollY();

    // Check if target is already reached on mount / initial layout
    const checkInitialPosition = () => {
      if (!targetRef?.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 800;
      const reachThreshold = viewportHeight * reachRatio;

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
        const isScrollingDown = delta > 0.5;

        if (targetRef?.current) {
          const rect = targetRef.current.getBoundingClientRect();
          const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight || 800;
          const reachThreshold = viewportHeight * reachRatio;
          const resetThreshold = viewportHeight * resetRatio;

          // Once target element reaches the viewing area, mark as reached
          if (rect.top <= reachThreshold) {
            hasReachedRef.current = true;
          } else if (rect.top > resetThreshold || currentScrollY < resetScrollY) {
            // User scrolled back up to hero/top section
            hasReachedRef.current = false;
          }
        }

        // Only blur when scrolling down towards it AND not yet reached!
        const shouldBlur = isScrollingDown && !hasReachedRef.current;

        if (shouldBlur) {
          if (!isBlurredRef.current) {
            isBlurredRef.current = true;
            setIsBlurred(true);
          }

          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          // If user stops scrolling before reaching, gracefully clear blur
          timeoutRef.current = setTimeout(() => {
            if (isBlurredRef.current) {
              isBlurredRef.current = false;
              setIsBlurred(false);
            }
          }, delay);
        } else {
          // If reached, scrolling up, or idle: immediately remove blur
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetRef, delay, reachRatio, resetRatio, resetScrollY]);

  return isBlurred;
}