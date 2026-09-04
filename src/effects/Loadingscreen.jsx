import { useEffect, useState } from "react";

export default function LoadingScreen({ minDuration = 1800 }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // trigger the slide-in on the next frame so the initial
    // (off-screen) position actually renders before transitioning
    const raf = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(minDuration - elapsed, 0);

      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setVisible(false), 500);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      return () => window.removeEventListener("load", finish);
    }
  }, [minDuration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center gap-4 bg-black transition-opacity duration-500 overflow-hidden ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* logo slides in from the left */}
      <img
        src="https://v0-chirayu-durgude.vercel.app/tpc-logo.svg"
        alt="TPC"
        className={`h-28 md:h-32 transition-all duration-700 ease-out ${
          animateIn ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
        }`}
      />

      {/* full form slides in from the right */}
      <p
        className={`text-white text-sm md:text-lg font-bold tracking-widest uppercase transition-all duration-700 ease-out delay-150 ${
          animateIn ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
        }`}
      >
        Training &amp; Placement Committee
      </p>
    </div>
  );
}