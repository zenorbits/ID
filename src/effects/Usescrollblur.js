import { useEffect, useState, useRef } from "react";

// Returns true while the user is actively scrolling,
// flips back to false shortly after scrolling stops.
export default function useScrollBlur(delay = 80) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // throttle with rAF so we're not spamming setState on every
      // scroll event — keeps things snappy instead of laggy
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        setIsScrolling(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, delay);

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return isScrolling;
}