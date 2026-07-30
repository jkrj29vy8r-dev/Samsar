"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  /** Valoarea finală (poate fi negativă). */
  value: number;
  /** Cum se formatează numărul afișat. */
  format: (n: number) => string;
  /** Durata animației în ms. */
  duration?: number;
}

/** Numără animat de la 0 la valoare. Respectă prefers-reduced-motion. */
export function CountUp({ value, format, duration = 750 }: CountUpProps) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{format(n)}</>;
}
